// src/services/studentService.js
import { supabase } from '../lib/supabase';

export const studentService = {
  // Get all students for teachers
  async getStudents() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          group:groups(name, course)
        `)
        .eq('role', 'student')
        .order('full_name');

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.log('Error fetching students:', err);
      throw err;
    }
  },

  // Create a new student
  async createStudent(studentData) {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: studentData.email,
        password: studentData.password,
        email_confirm: true,
        user_metadata: {
          full_name: studentData.full_name,
          role: 'student'
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Update the user profile with additional data
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          alias: studentData.alias,
          grade_level: studentData.grade_level,
          group_id: studentData.group_id
        })
        .eq('id', authData.user.id)
        .select(`
          *,
          group:groups(name, course)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error creating student:', err);
      throw err;
    }
  },

  // Update student information
  async updateStudent(studentId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', studentId)
        .select(`
          *,
          group:groups(name, course)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error updating student:', err);
      throw err;
    }
  },

  // Update student name/full_name
  async updateStudentName(studentId, newName) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ full_name: newName })
        .eq('id', studentId)
        .select(`
          *,
          group:groups(name, course)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error updating student name:', err);
      throw err;
    }
  },

  // Get student performance data
  async getStudentPerformance(studentId) {
    try {
      const { data, error } = await supabase
        .from('practice_attempts')
        .select(`
          *,
          practice:practices(title, max_points)
        `)
        .eq('student_id', studentId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.log('Error fetching student performance:', err);
      throw err;
    }
  },

  // Reset student password
  async resetStudentPassword(studentId, newPassword) {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(
        studentId,
        { password: newPassword }
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.log('Error resetting student password:', err);
      throw err;
    }
  },

  // Generate student credentials
  generateStudentCredentials() {
    const colors = ['Red', 'Blue', 'Green', 'Purple', 'Silver', 'Gold', 'Black', 'White'];
    const animals = ['Fox', 'Dragon', 'Ninja', 'Panda', 'Eagle', 'Wolf', 'Tiger', 'Lion'];
    const nature = ['Sky', 'Ocean', 'Forest', 'Star', 'Moon', 'Sun', 'River', 'Mountain'];
    const astronomy = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Nova', 'Comet', 'Nebula'];
    const music = ['Disco', 'Waltz', 'Jazz', 'Rock', 'Blues', 'Funk', 'Tango', 'Salsa'];

    const alias = `${colors[Math.floor(Math.random() * colors.length)]}${animals[Math.floor(Math.random() * animals.length)]}${nature[Math.floor(Math.random() * nature.length)]}`;
    const password = `${astronomy[Math.floor(Math.random() * astronomy.length)]}${music[Math.floor(Math.random() * music.length)]}`;

    return { alias, password };
  },

  // Bulk create students for a group
  async createStudentsForGroup(groupId, studentCount) {
    try {
      const students = [];
      
      for (let i = 0; i < studentCount; i++) {
        const credentials = this.generateStudentCredentials();
        const email = `${credentials.alias.toLowerCase()}@student.local`;
        
        const studentData = {
          email,
          password: credentials.password,
          full_name: 'Estudiante',
          alias: credentials.alias,
          group_id: groupId,
          grade_level: null // Will be set based on group
        };

        const student = await this.createStudent(studentData);
        students.push({
          ...student,
          originalPassword: credentials.password
        });
      }

      return students;
    } catch (err) {
      console.log('Error creating students for group:', err);
      throw err;
    }
  },

  // Export student data to CSV format
  exportStudentsToCSV(students) {
    const headers = ['Nombre', 'Alias', 'Contraseña', 'Grupo', 'Puntos Totales', 'Último Acceso'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.full_name,
        student.alias || '',
        student.originalPassword || 'N/A',
        student.group?.name || 'Sin grupo',
        student.total_points || 0,
        student.last_access ? new Date(student.last_access).toLocaleDateString() : 'Nunca'
      ].join(','))
    ].join('\n');

    return csvContent;
  },

  // Download CSV file
  downloadCSV(csvContent, filename = 'estudiantes.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default studentService;