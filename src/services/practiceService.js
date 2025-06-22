// src/services/practiceService.js
import { supabase } from '../lib/supabase';

export const practiceService = {
  // Get all practices for a teacher
  async getPractices() {
    try {
      const { data, error } = await supabase
        .from('practices')
        .select(`
          *,
          teacher:user_profiles!practices_teacher_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.log('Error fetching practices:', err);
      throw err;
    }
  },

  // Get active practices for students
  async getActivePractices() {
    try {
      const { data, error } = await supabase
        .from('practices')
        .select('*')
        .eq('is_active', true)
        .gte('start_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Within last 24 hours
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.log('Error fetching active practices:', err);
      throw err;
    }
  },

  // Create a new practice
  async createPractice(practiceData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('practices')
        .insert({
          ...practiceData,
          teacher_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error creating practice:', err);
      throw err;
    }
  },

  // Update a practice
  async updatePractice(practiceId, updates) {
    try {
      const { data, error } = await supabase
        .from('practices')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', practiceId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error updating practice:', err);
      throw err;
    }
  },

  // Toggle practice status
  async togglePracticeStatus(practiceId, currentStatus) {
    try {
      const newStatus = currentStatus === 'active' ? false : true;
      
      const { data, error } = await supabase
        .from('practices')
        .update({ 
          is_active: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', practiceId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error toggling practice status:', err);
      throw err;
    }
  },

  // Delete a practice
  async deletePractice(practiceId) {
    try {
      const { error } = await supabase
        .from('practices')
        .delete()
        .eq('id', practiceId);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (err) {
      console.log('Error deleting practice:', err);
      throw err;
    }
  },

  // Duplicate a practice
  async duplicatePractice(practiceId) {
    try {
      const { data: originalPractice, error: fetchError } = await supabase
        .from('practices')
        .select('*')
        .eq('id', practiceId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const duplicatedPractice = {
        ...originalPractice,
        id: undefined, // Let Supabase generate new ID
        title: `${originalPractice.title} (Copia)`,
        is_active: false,
        teacher_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('practices')
        .insert(duplicatedPractice)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error duplicating practice:', err);
      throw err;
    }
  },

  // Get practice attempts for a specific practice
  async getPracticeAttempts(practiceId) {
    try {
      const { data, error } = await supabase
        .from('practice_attempts')
        .select(`
          *,
          student:user_profiles!practice_attempts_student_id_fkey(full_name, alias),
          practice:practices!practice_attempts_practice_id_fkey(title)
        `)
        .eq('practice_id', practiceId)
        .order('completed_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.log('Error fetching practice attempts:', err);
      throw err;
    }
  },

  // Submit a practice attempt
  async submitPracticeAttempt(practiceId, answers, timeSpent) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get practice details to calculate score
      const { data: practice, error: practiceError } = await supabase
        .from('practices')
        .select('*')
        .eq('id', practiceId)
        .single();

      if (practiceError) {
        throw new Error(practiceError.message);
      }

      // Calculate score based on correct answers
      const questions = practice.questions || [];
      let correctAnswers = 0;
      
      questions.forEach((question, index) => {
        if (answers[index] === question.correct) {
          correctAnswers++;
        }
      });

      const score = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;
      let pointsEarned = Math.round((score / 100) * practice.max_points);

      // Apply time bonus if graded_duration is enabled
      if (practice.graded_duration && timeSpent < practice.duration_minutes) {
        const timeBonus = Math.max(0, (practice.duration_minutes - timeSpent) / practice.duration_minutes * 0.1);
        pointsEarned = Math.round(pointsEarned * (1 + timeBonus));
      }

      // Get attempt number
      const { data: existingAttempts } = await supabase
        .from('practice_attempts')
        .select('attempt_number')
        .eq('practice_id', practiceId)
        .eq('student_id', user.id)
        .order('attempt_number', { ascending: false })
        .limit(1);

      const attemptNumber = existingAttempts?.length > 0 ? existingAttempts[0].attempt_number + 1 : 1;

      const { data, error } = await supabase
        .from('practice_attempts')
        .insert({
          practice_id: practiceId,
          student_id: user.id,
          attempt_number: attemptNumber,
          score: score,
          points_earned: pointsEarned,
          time_spent_minutes: timeSpent,
          answers: answers,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update student total points
      await supabase
        .from('user_profiles')
        .update({ 
          total_points: supabase.sql`total_points + ${pointsEarned}` 
        })
        .eq('id', user.id);

      return data;
    } catch (err) {
      console.log('Error submitting practice attempt:', err);
      throw err;
    }
  }
};

export default practiceService;