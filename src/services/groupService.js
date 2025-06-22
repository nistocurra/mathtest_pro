// src/services/groupService.js
import { supabase } from '../lib/supabase';
import { studentService } from './studentService';

export const groupService = {
  // Get all groups for a teacher
  async getGroups() {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          teacher:user_profiles!groups_teacher_id_fkey(full_name),
          students:user_profiles!user_profiles_group_id_fkey(id, full_name, alias, total_points)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.log('Error fetching groups:', err);
      throw err;
    }
  },

  // Create a new group
  async createGroup(groupData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupData.name,
          course: groupData.course,
          student_count: groupData.student_count,
          teacher_id: user.id
        })
        .select()
        .single();

      if (groupError) {
        throw new Error(groupError.message);
      }

      // Generate students for the group
      const students = await studentService.createStudentsForGroup(
        group.id,
        groupData.student_count
      );

      // Update students with correct grade level from group
      await supabase
        .from('user_profiles')
        .update({ grade_level: groupData.course })
        .eq('group_id', group.id);

      return {
        ...group,
        students: students
      };
    } catch (err) {
      console.log('Error creating group:', err);
      throw err;
    }
  },

  // Update a group
  async updateGroup(groupId, updates) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .update(updates)
        .eq('id', groupId)
        .select(`
          *,
          teacher:user_profiles!groups_teacher_id_fkey(full_name),
          students:user_profiles!user_profiles_group_id_fkey(id, full_name, alias, total_points)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error updating group:', err);
      throw err;
    }
  },

  // Delete a group
  async deleteGroup(groupId) {
    try {
      // First, remove group reference from students
      await supabase
        .from('user_profiles')
        .update({ group_id: null })
        .eq('group_id', groupId);

      // Then delete the group
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (err) {
      console.log('Error deleting group:', err);
      throw err;
    }
  },

  // Add a student to an existing group
  async addStudentToGroup(groupId) {
    try {
      // Get group details
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) {
        throw new Error(groupError.message);
      }

      // Generate student credentials
      const credentials = studentService.generateStudentCredentials();
      const email = `${credentials.alias.toLowerCase()}@student.local`;
      
      const studentData = {
        email,
        password: credentials.password,
        full_name: 'Estudiante',
        alias: credentials.alias,
        group_id: groupId,
        grade_level: group.course
      };

      const student = await studentService.createStudent(studentData);
      
      // Update group student count
      await supabase
        .from('groups')
        .update({ student_count: group.student_count + 1 })
        .eq('id', groupId);

      return {
        ...student,
        originalPassword: credentials.password
      };
    } catch (err) {
      console.log('Error adding student to group:', err);
      throw err;
    }
  },

  // Get group with students for CSV export
  async getGroupForExport(groupId) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          students:user_profiles!user_profiles_group_id_fkey(
            id,
            full_name,
            alias,
            total_points,
            last_access
          )
        `)
        .eq('id', groupId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error fetching group for export:', err);
      throw err;
    }
  },

  // Export group data to CSV
  async exportGroupToCSV(groupId) {
    try {
      const group = await this.getGroupForExport(groupId);
      const csvContent = studentService.exportStudentsToCSV(group.students || []);
      
      const filename = `grupo_${group.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
      studentService.downloadCSV(csvContent, filename);
      
      return true;
    } catch (err) {
      console.log('Error exporting group to CSV:', err);
      throw err;
    }
  },

  // Get group statistics
  async getGroupStats(groupId) {
    try {
      const { data: students, error: studentsError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          total_points,
          last_access,
          practice_attempts:practice_attempts(score, completed_at)
        `)
        .eq('group_id', groupId);

      if (studentsError) {
        throw new Error(studentsError.message);
      }

      const stats = {
        totalStudents: students.length,
        activeStudents: students.filter(s => {
          const lastAccess = new Date(s.last_access);
          const daysSinceAccess = (Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceAccess <= 7;
        }).length,
        averagePoints: students.length > 0 ? 
          Math.round(students.reduce((sum, s) => sum + (s.total_points || 0), 0) / students.length) : 0,
        totalPracticesCompleted: students.reduce((sum, s) => sum + (s.practice_attempts?.length || 0), 0)
      };

      return stats;
    } catch (err) {
      console.log('Error fetching group stats:', err);
      throw err;
    }
  }
};

export default groupService;