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
        .upsert([parentData], { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
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

  // Find or create parent by email, then create student
  static async createStudentWithParent(studentData: StudentData, parentData: ParentData) {
    try {
      let parentResult;

      // Always check for existing parent by email first
      if (parentData.email) {
        const { data: existingParents, error: findError } = await supabase
          .from('parents')
          .select('*')
          .eq('email', parentData.email)
          .maybeSingle();

        if (findError) {
          return { data: null, error: findError.message };
        }

        if (existingParents) {
          // Parent exists, use existing parent
          parentResult = { data: existingParents, error: null };
        } else {
          // Parent doesn't exist, create new one using upsert to handle any race conditions
          const { data, error } = await supabase
            .from('parents')
            .upsert([parentData], { 
              onConflict: 'email',
              ignoreDuplicates: false 
            })
            .select()
            .single();

          if (error) {
            return { data: null, error: error.message };
          }
          parentResult = { data, error: null };
        }
      } else {
        return { data: null, error: 'Parent email is required' };
      }

      // Then create the student with the parent's ID
      const studentDataWithParent = {
        ...studentData,
        primary_parent_id: parentResult.data.id
      };

      const studentResult = await this.createStudent(studentDataWithParent);
      if (studentResult.error) {
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

  // Generate unique IDs with sequential numbering
  static async getNextAdmissionNumber(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('admission_number')
        .order('admission_number', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error getting last admission number:', error);
        // Fallback to random if query fails
        return this.generateAdmissionNumber();
      }

      const currentYear = new Date().getFullYear();
      const yearPrefix = `ADM${currentYear}`;

      if (!data || data.length === 0) {
        return `${yearPrefix}0001`;
      }

      const lastNumber = data[0].admission_number;
      if (lastNumber && lastNumber.startsWith(yearPrefix)) {
        const lastSequence = parseInt(lastNumber.slice(-4)) || 0;
        const nextSequence = (lastSequence + 1).toString().padStart(4, '0');
        return `${yearPrefix}${nextSequence}`;
      } else {
        return `${yearPrefix}0001`;
      }
    } catch (error) {
      console.error('Error generating admission number:', error);
      return this.generateAdmissionNumber();
    }
  }

  static async getNextEmployeeId(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('employee_id')
        .order('employee_id', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error getting last employee ID:', error);
        return this.generateEmployeeId();
      }

      const currentYear = new Date().getFullYear();
      const yearPrefix = `EMP${currentYear}`;

      if (!data || data.length === 0) {
        return `${yearPrefix}001`;
      }

      const lastNumber = data[0].employee_id;
      if (lastNumber && lastNumber.startsWith(yearPrefix)) {
        const lastSequence = parseInt(lastNumber.slice(-3)) || 0;
        const nextSequence = (lastSequence + 1).toString().padStart(3, '0');
        return `${yearPrefix}${nextSequence}`;
      } else {
        return `${yearPrefix}001`;
      }
    } catch (error) {
      console.error('Error generating employee ID:', error);
      return this.generateEmployeeId();
    }
  }

  // Fallback methods for backwards compatibility
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

  // Validate uniqueness of IDs
  static async validateAdmissionNumber(admissionNumber: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .eq('admission_number', admissionNumber)
        .limit(1);

      return !error && (!data || data.length === 0);
    } catch {
      return false;
    }
  }

  static async validateEmployeeId(employeeId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('id')
        .eq('employee_id', employeeId)
        .limit(1);

      return !error && (!data || data.length === 0);
    } catch {
      return false;
    }
  }
}