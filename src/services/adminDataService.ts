import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  admission_number?: string;
  roll_number?: string;
  class_name?: string;
  section?: string;
  religion?: string;
  nationality?: string;
  father_name?: string;
  mother_name?: string;
  father_occupation?: string;
  mother_occupation?: string;
  present_address?: string;
  permanent_address?: string;
  student_photo_url?: string;
  parent_photo_url?: string;
  primary_parent_id?: string;
}

export interface TeacherData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  employee_id?: string;
  subject?: string;
  class_assigned?: string;
  section_assigned?: string;
  religion?: string;
  qualification?: string;
  experience_years?: number;
  teacher_photo_url?: string;
}

export interface ParentData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  gender?: string;
  occupation?: string;
  relationship_to_student?: string;
}

export interface AccountData {
  account_type: 'admin' | 'finance' | 'accountant' | 'registrar';
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department?: string;
  permissions?: string[];
  is_active?: boolean;
}

export class AdminDataService {
  // Student operations
  static async createStudent(studentData: StudentData) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async getStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async updateStudent(id: string, studentData: Partial<StudentData>) {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async deleteStudent(id: string) {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Teacher operations
  static async createTeacher(teacherData: TeacherData) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert([teacherData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async getTeachers() {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async getTeacherById(id: string) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async updateTeacher(id: string, teacherData: Partial<TeacherData>) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .update(teacherData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async deleteTeacher(id: string) {
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Parent operations
  static async createParent(parentData: ParentData) {
    try {
      const { data, error } = await supabase
        .from('parents')
        .insert([parentData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async getParents() {
    try {
      const { data, error } = await supabase
        .from('parents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async updateParent(id: string, parentData: Partial<ParentData>) {
    try {
      const { data, error } = await supabase
        .from('parents')
        .update(parentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async deleteParent(id: string) {
    try {
      const { error } = await supabase
        .from('parents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Account operations
  static async createAccount(accountData: AccountData) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([accountData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async getAccounts() {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Student-Parent relationship operations
  static async linkStudentToParent(studentId: string, parentId: string, relationshipType: 'father' | 'mother' | 'guardian') {
    try {
      const { data, error } = await supabase
        .from('student_parents')
        .insert([{
          student_id: studentId,
          parent_id: parentId,
          relationship_type: relationshipType
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Get student with parent information
  static async getStudentWithParent(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          primary_parent:primary_parent_id(*)
        `)
        .eq('id', studentId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Get parent with their children
  static async getParentWithChildren(parentId: string) {
    try {
      const { data, error } = await supabase
        .from('parents')
        .select(`
          *,
          children:students!primary_parent_id(*),
          student_relationships:student_parents(
            student:students(*)
          )
        `)
        .eq('id', parentId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Get students with their parent information
  static async getStudentsWithParents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          primary_parent:primary_parent_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Create student and parent together
  static async createStudentWithParent(studentData: StudentData, parentData: ParentData) {
    try {
      // First create the parent
      const parentResult = await this.createParent(parentData);
      if (parentResult.error) {
        return { data: null, error: parentResult.error };
      }

      // Then create the student with the parent's ID
      const studentDataWithParent = {
        ...studentData,
        primary_parent_id: parentResult.data.id
      };

      const studentResult = await this.createStudent(studentDataWithParent);
      if (studentResult.error) {
        // If student creation fails, we should consider cleaning up the parent
        // For now, we'll just return the error
        return { data: null, error: studentResult.error };
      }

      return { 
        data: { 
          student: studentResult.data, 
          parent: parentResult.data 
        }, 
        error: null 
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Generate unique IDs
  static generateAdmissionNumber(): string {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ADM${currentYear}${randomNum}`;
  }

  static generateEmployeeId(): string {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EMP${currentYear}${randomNum}`;
  }
}