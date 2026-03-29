import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  supabase, 
  getStories, 
  getTeacherStudents,
  getLastActivityByStudentIds,
  getStudentProgress,
  getStudentProgressStats,
  completeStory,
  createStory, 
  updateStory, 
  deleteStory,
  deleteStoryParagraphs,
  insertStoryParagraphs,
  getComprehensionQuestionsByStory,
  createComprehensionQuestion,
  updateComprehensionQuestion,
  deleteComprehensionQuestion,
  enqueueL5AudioJob,
  type ComprehensionQuestion,
} from '../lib/supabase';
import { getParagraphs } from '../data/stories';
import type { Teacher, Student } from '../lib/supabase-types';
import { signOut } from '../lib/auth';
import { clearUser } from '../store/userSlice';
import type { AppDispatch } from '../store/store';
import { getStoryImageUrl } from '../lib/image-utils';
import { getApiEnv, setApiEnv, getApiBase, getAppMode, setAppMode, type ApiEnv, type AppMode } from '../lib/api';

type TabType = 'teachers' | 'students' | 'stories' | 'settings' | 'view-student';

export default function AdminPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<TabType>('teachers');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'teachers' || activeTab === 'students' || activeTab === 'view-student') {
      fetchTeachersAndStudents();
    }
  }, [activeTab]);

  // Note: Stories tab has its own fetch logic within StoriesTab component

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*, users(email)')
        .order('created_at', { ascending: false });

      if (!error) {
        setTeachers(data || []);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*, users(email), teachers(id, first_name, last_name, school_name)')
        .order('created_at', { ascending: false });

      if (!error) {
        setStudents(data || []);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachersAndStudents = async () => {
    setLoading(true);
    try {
      const [teachersResult, studentsResult] = await Promise.all([
        supabase
          .from('teachers')
          .select('*, users(email)')
          .order('created_at', { ascending: false }),
        supabase
          .from('students')
          .select('*, users(email), teachers(id, first_name, last_name, school_name)')
          .order('created_at', { ascending: false })
      ]);

      if (!teachersResult.error) {
        setTeachers(teachersResult.data || []);
      }

      if (!studentsResult.error) {
        setStudents(studentsResult.data || []);
      }
    } catch (err) {
      console.error('Error fetching teachers/students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }

    // Clear Redux state
    dispatch(clearUser());

    // Clear localStorage
    localStorage.removeItem('dost_role');
    localStorage.removeItem('dost_teacher');
    localStorage.removeItem('dost_student');

    // Redirect to home
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Paneli</h1>
            {import.meta.env.MODE === 'production' && (
              <p className="text-sm text-purple-200 mt-1">
                Versiyon: {import.meta.env.VITE_APP_VERSION || '1.0.0'} 
                {import.meta.env.VITE_GIT_COMMIT && ` (${import.meta.env.VITE_GIT_COMMIT.substring(0, 7)})`}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {(['teachers', 'students', 'view-student', 'stories', 'settings'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {tab === 'teachers' && 'Öğretmenler'}
              {tab === 'students' && 'Öğrenciler'}
              {tab === 'view-student' && 'Öğrenci Görünümü'}
              {tab === 'stories' && 'Hikayeler'}
              {tab === 'settings' && 'Ayarlar'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : activeTab === 'teachers' ? (
          <TeachersTab teachers={teachers} studentCount={students.length} />
        ) : activeTab === 'students' ? (
          <StudentsTab students={students} teacherCount={teachers.length} />
        ) : activeTab === 'view-student' ? (
          <ViewStudentTab teachers={teachers} students={students} loading={loading} />
        ) : activeTab === 'settings' ? (
          <SettingsTab />
        ) : (
          <StoriesTab />
        )}
      </div>
    </div>
  );
}

function TeachersTab({ teachers, studentCount }: { teachers: any[]; studentCount: number }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-purple-100">
          <p className="text-sm text-gray-500">Toplam öğretmen</p>
          <p className="text-2xl font-bold text-purple-800">{teachers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-blue-100">
          <p className="text-sm text-gray-500">Toplam öğrenci</p>
          <p className="text-2xl font-bold text-blue-800">{studentCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Okul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturulma Tarihi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {teacher.first_name} {teacher.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {teacher.users?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {teacher.school_name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(teacher.created_at).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teachers.length === 0 && (
          <div className="text-center py-8 text-gray-600">Öğretmen bulunamadı</div>
        )}
      </div>
    </div>
  );
}

function StudentsTab({ students, teacherCount }: { students: any[]; teacherCount: number }) {
  const [showLevelEditor, setShowLevelEditor] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [newLevel, setNewLevel] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stories, setStories] = useState<any[]>([]);
  const [studentProgress, setStudentProgress] = useState<any[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [studentSearchFilter, setStudentSearchFilter] = useState('');
  const [unlockLoading, setUnlockLoading] = useState<string | null>(null);

  useEffect(() => {
    if (showLevelEditor) {
      fetchStoriesForEditor();
    }
  }, [showLevelEditor]);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentProgress();
    } else {
      setStudentProgress([]);
    }
  }, [selectedStudent]);

  const fetchStoriesForEditor = async () => {
    try {
      const { data, error: err } = await getStories();
      if (err) throw err;
      setStories(data || []);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Hikayeler yüklenemedi');
    }
  };

  const fetchStudentProgress = async () => {
    if (!selectedStudent) return;
    
    setLoadingProgress(true);
    try {
      const { data, error: err } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', selectedStudent)
        .order('story_id', { ascending: true });

      if (err) throw err;
      setStudentProgress(data || []);
    } catch (err) {
      console.error('Error fetching student progress:', err);
      setStudentProgress([]);
    } finally {
      setLoadingProgress(false);
    }
  };

  const q = (studentSearchFilter || '').trim().toLowerCase();
  const filteredStudents = q
    ? students.filter(
        (s: any) =>
          `${(s.first_name || '')} ${(s.last_name || '')}`.toLowerCase().includes(q) ||
          (s.users?.email || '').toLowerCase().includes(q)
      )
    : students;

  const handleUnlockStory = async (studentId: string, storyId: number) => {
    setUnlockLoading(`${studentId}-${storyId}`);
    setError('');
    setSuccess('');
    try {
      const { error: unlockError } = await completeStory(studentId, storyId);
      if (unlockError) throw unlockError;
      setSuccess(`Hikaye ${storyId} tamamlandı işaretlendi, sonraki hikaye kilidi açıldı.`);
      await fetchStudentProgress();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kilit açılamadı');
    } finally {
      setUnlockLoading(null);
    }
  };

  const handleUpdateLevel = async () => {
    if (!selectedStudent || !selectedStory || !newLevel) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Updating level:', {
        student_id: selectedStudent,
        story_id: parseInt(selectedStory),
        new_level: parseInt(newLevel)
      });

      const { data: existingProgress, error: fetchError } = await supabase
        .from('student_progress')
        .select('id, current_level')
        .eq('student_id', selectedStudent)
        .eq('story_id', parseInt(selectedStory))
        .single();

      console.log('Existing progress:', existingProgress, 'Error:', fetchError);

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }

      if (!existingProgress) {
        // Initialize progress if it doesn't exist
        const { error: initError } = await supabase
          .from('student_progress')
          .insert({
            student_id: selectedStudent,
            story_id: parseInt(selectedStory),
            current_level: parseInt(newLevel),
            current_step: 1,
            completed_levels: [],
            is_completed: false,
            points: 0,
          });

        if (initError) throw initError;
      } else {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('student_progress')
          .update({
            current_level: parseInt(newLevel),
            current_step: 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id)
          .select();

        if (updateError) throw updateError;
      }

      // Verify the update was successful
      const { data: verifyProgress, error: verifyError } = await supabase
        .from('student_progress')
        .select('current_level')
        .eq('student_id', selectedStudent)
        .eq('story_id', parseInt(selectedStory))
        .single();

      if (verifyError) {
        console.error('Verification error:', verifyError);
        throw new Error('Güncelleme doğrulanamadı');
      }

      if (verifyProgress?.current_level !== parseInt(newLevel)) {
        throw new Error('Güncelleme başarısız oldu - seviye değişmedi');
      }

      setSuccess(`Seviye başarıyla güncellendi: Seviye ${newLevel}. Lütfen öğrenci giriş yaptığında sayfayı yenilesin.`);
      console.log('Level update successful:', verifyProgress);
      
      // Refresh progress after update
      await fetchStudentProgress();
      
      // Clear form after a delay
      setTimeout(() => {
        setSelectedStory('');
        setNewLevel('1');
        setSuccess('');
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Güncelleme başarısız oldu';
      setError(message);
      console.error('Error updating level:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-blue-100">
          <p className="text-sm text-gray-500">Toplam öğrenci</p>
          <p className="text-2xl font-bold text-blue-800">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-purple-100">
          <p className="text-sm text-gray-500">Toplam öğretmen</p>
          <p className="text-2xl font-bold text-purple-800">{teacherCount}</p>
        </div>
      </div>

      <button
        onClick={() => setShowLevelEditor(!showLevelEditor)}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        {showLevelEditor ? 'İptal' : '⚙️ Seviye Düzenle'}
      </button>

      {showLevelEditor && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-800">Öğrenci Seviyesi Düzenle</h3>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✅ {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci ara</label>
            <input
              type="text"
              placeholder="Ad, soyad veya e-posta ile filtrele..."
              value={studentSearchFilter}
              onChange={(e) => setStudentSearchFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Seçiniz --</option>
              {filteredStudents.map((student: any) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} ({student.users?.email})
                </option>
              ))}
            </select>
            {studentSearchFilter.trim() && (
              <p className="text-xs text-gray-500 mt-1">{filteredStudents.length} öğrenci listeleniyor</p>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hikaye</label>
            <select
              value={selectedStory}
              onChange={(e) => {
                setSelectedStory(e.target.value);
                // Auto-fill current level when story is selected
                if (selectedStudent && e.target.value) {
                  const progress = studentProgress.find(
                    p => p.story_id === parseInt(e.target.value)
                  );
                  if (progress) {
                    setNewLevel(progress.current_level.toString());
                  } else {
                    setNewLevel('1');
                  }
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Seçiniz --</option>
              {stories.map((story) => {
                const progress = studentProgress.find(p => p.story_id === story.id);
                const currentLevel = progress ? progress.current_level : null;
                return (
                  <option key={story.id} value={story.id}>
                    {story.title} {currentLevel ? `(Mevcut: Seviye ${currentLevel})` : '(Başlanmamış)'}
                  </option>
                );
              })}
            </select>
          </div>

          {selectedStory && selectedStudent && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-800">
                {(() => {
                  const progress = studentProgress.find(
                    p => p.story_id === parseInt(selectedStory)
                  );
                  if (progress) {
                    return `Mevcut Seviye: ${progress.current_level}`;
                  }
                  return 'Bu hikayede henüz ilerleme kaydı yok.';
                })()}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Seviye</label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <button
            onClick={handleUpdateLevel}
            disabled={loading || !selectedStudent || !selectedStory}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors font-medium"
          >
            {loading ? 'Güncelleniyor...' : 'Seviyeyi Güncelle'}
          </button>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Hikaye kilidi aç</h4>
            <p className="text-xs text-gray-600 mb-2">
              Öğrenci ve hikaye seçip aşağıdaki butonla bu hikayeyi tamamlandı işaretleyebilirsiniz; bir sonraki hikaye kilidi açılır.
            </p>
            <button
              type="button"
              onClick={() => selectedStudent && selectedStory && handleUnlockStory(selectedStudent, parseInt(selectedStory))}
              disabled={!selectedStudent || !selectedStory || !!unlockLoading}
              className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
            >
              {unlockLoading ? 'İşleniyor...' : 'Bu hikayeyi tamamlandı işaretle (sonraki kilidi aç)'}
            </button>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {students.find(s => s.id === selectedStudent)?.first_name}{' '}
              {students.find(s => s.id === selectedStudent)?.last_name} - Mevcut Seviyeler
            </h3>
          </div>
          {loadingProgress ? (
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          ) : studentProgress.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Bu öğrencinin henüz hiçbir hikayede ilerleme kaydı yok.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hikaye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mevcut Seviye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mevcut Adım
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamamlanan Seviyeler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentProgress.map((progress) => {
                  const story = stories.find(s => s.id === progress.story_id);
                  const key = `${selectedStudent}-${progress.story_id}`;
                  return (
                    <tr key={progress.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {story?.title || `Hikaye ${progress.story_id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold">
                          Seviye {progress.current_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Adım {progress.current_step}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {Array.isArray(progress.completed_levels) && progress.completed_levels.length > 0
                          ? progress.completed_levels.join(', ')
                          : 'Yok'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {progress.points || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {progress.is_completed ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                            Tamamlandı
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                            Devam Ediyor
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!progress.is_completed && (
                          <button
                            type="button"
                            onClick={() => handleUnlockStory(selectedStudent, progress.story_id)}
                            disabled={unlockLoading === key}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded disabled:opacity-50"
                          >
                            {unlockLoading === key ? '...' : 'Kilit aç'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {studentSearchFilter.trim() && (
          <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
            Arama: &quot;{studentSearchFilter}&quot; — {filteredStudents.length} öğrenci
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Öğretmen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturulma Tarihi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student: any) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.first_name} {student.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {student.users?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {student.teachers?.first_name} {student.teachers?.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(student.created_at).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            {studentSearchFilter.trim() ? 'Arama kriterine uyan öğrenci bulunamadı.' : 'Öğrenci bulunamadı'}
          </div>
        )}
      </div>
    </div>
  );
}

const NO_SCHOOL_LABEL = 'Okul belirtilmemiş';

/** Okula göre gruplanmış öğretmen/öğrenci listesi + okul/öğretmen/öğrenci filtreleri */
function ViewStudentTab({ teachers, students, loading }: { teachers: any[]; students: any[]; loading: boolean }) {
  const [expandedTeacherId, setExpandedTeacherId] = useState<string | null>(null);
  const [teacherStudents, setTeacherStudents] = useState<Record<string, any[]>>({});
  const [loadingStudents, setLoadingStudents] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');
  const [filterStudentSearch, setFilterStudentSearch] = useState('');
  const [sortByLastActivity, setSortByLastActivity] = useState<boolean>(false);
  const [studentLastActivity, setStudentLastActivity] = useState<Record<string, string>>({});
  const [allStudentsByActivity, setAllStudentsByActivity] = useState<Array<{ student: any; teacher: any }>>([]);
  const [loadingAllByActivity, setLoadingAllByActivity] = useState(false);

  const schoolNames = Array.from(
    new Set(teachers.map((t: any) => (t.school_name && String(t.school_name).trim()) || NO_SCHOOL_LABEL))
  ).sort((a, b) => (a === NO_SCHOOL_LABEL ? 1 : b === NO_SCHOOL_LABEL ? -1 : a.localeCompare(b)));

  const studentCountsBySchool = students.reduce<Record<string, number>>((acc, student: any) => {
    const school = (student.teachers?.school_name && String(student.teachers.school_name).trim()) || NO_SCHOOL_LABEL;
    acc[school] = (acc[school] || 0) + 1;
    return acc;
  }, {});

  const teachersBySchool = schoolNames.reduce<Record<string, any[]>>((acc, school) => {
    acc[school] = teachers.filter(
      (t: any) => ((t.school_name && String(t.school_name).trim()) || NO_SCHOOL_LABEL) === school
    );
    return acc;
  }, {});

  const teachersFilteredBySchool =
    filterSchool === 'all'
      ? teachers
      : teachers.filter(
          (t: any) => ((t.school_name && String(t.school_name).trim()) || NO_SCHOOL_LABEL) === filterSchool
        );

  const visibleTeacherIds =
    filterTeacher === 'all'
      ? teachersFilteredBySchool.map((t: any) => t.id)
      : teachersFilteredBySchool.filter((t: any) => t.id === filterTeacher).map((t: any) => t.id);

  const handleToggleTeacher = async (teacherId: string) => {
    if (expandedTeacherId === teacherId) {
      setExpandedTeacherId(null);
      return;
    }
    setExpandedTeacherId(teacherId);
    if (!teacherStudents[teacherId]) {
      setLoadingStudents(teacherId);
      try {
        const { data, error } = await getTeacherStudents(teacherId);
        if (!error) {
          const list = data || [];
          setTeacherStudents(prev => ({ ...prev, [teacherId]: list }));
          if (sortByLastActivity && list.length > 0) {
            const ids = list.map((s: any) => s.id);
            const lastActivity = await getLastActivityByStudentIds(ids);
            setStudentLastActivity(prev => ({ ...prev, ...lastActivity }));
          }
        }
      } catch (err) {
        console.error('Error fetching teacher students:', err);
      } finally {
        setLoadingStudents(null);
      }
    }
  };

  const handleSelectStudent = (student: any, teacher: any) => {
    setSelectedStudent(student);
    setSelectedTeacher(teacher);
  };

  const studentMatchesSearch = (student: any) => {
    if (!filterStudentSearch.trim()) return true;
    const q = filterStudentSearch.trim().toLowerCase();
    const full = `${(student.first_name || '')} ${(student.last_name || '')}`.toLowerCase();
    return full.includes(q) || (student.users?.email || '').toLowerCase().includes(q);
  };

  useEffect(() => {
    if (sortByLastActivity || visibleTeacherIds.length === 0) return;
    if (!filterStudentSearch.trim() && filterTeacher === 'all') return;

    const missingTeacherIds = visibleTeacherIds.filter((teacherId) => !teacherStudents[teacherId]);
    if (missingTeacherIds.length === 0) return;

    (async () => {
      try {
        await Promise.all(
          missingTeacherIds.map(async (teacherId) => {
            const { data, error } = await getTeacherStudents(teacherId);
            if (!error) {
              setTeacherStudents((prev) => ({ ...prev, [teacherId]: data || [] }));
            }
          })
        );
      } catch (err) {
        console.error('Error preloading teacher students for filters:', err);
      }
    })();
  }, [sortByLastActivity, filterStudentSearch, filterTeacher, visibleTeacherIds.join(','), teacherStudents]);

  useEffect(() => {
    if (filterTeacher === 'all') return;
    const t = teachers.find((x: any) => x.id === filterTeacher);
    if (!t) return;
    if (expandedTeacherId !== filterTeacher) setExpandedTeacherId(filterTeacher);
    if (teacherStudents[filterTeacher]) return;
    setLoadingStudents(filterTeacher);
    getTeacherStudents(filterTeacher).then(async ({ data, error }) => {
      if (!error) {
        const list = data || [];
        setTeacherStudents(prev => ({ ...prev, [filterTeacher]: list }));
        if (sortByLastActivity && list.length > 0) {
          const lastActivity = await getLastActivityByStudentIds(list.map((s: any) => s.id));
          setStudentLastActivity(prev => ({ ...prev, ...lastActivity }));
        }
      }
      setLoadingStudents(null);
    });
  }, [filterTeacher, teachers, sortByLastActivity]);

  useEffect(() => {
    if (!sortByLastActivity) {
      setAllStudentsByActivity([]);
      return;
    }
    setLoadingAllByActivity(true);
    (async () => {
      try {
        const { data: studentsData, error } = await supabase
          .from('students')
          .select('*, teachers(id, first_name, last_name, school_name)');
        if (error || !studentsData?.length) {
          setAllStudentsByActivity([]);
          return;
        }
        const ids = studentsData.map((s: any) => s.id);
        const lastActivity = await getLastActivityByStudentIds(ids);
        const teacherById = teachers.reduce((acc: Record<string, any>, t) => {
          acc[t.id] = t;
          return acc;
        }, {});
        const list = studentsData
          .map((s: any) => {
            const teacher = s.teachers || teacherById[s.teacher_id] || null;
            return { student: s, teacher };
          })
          .sort((a, b) => {
            const ta = lastActivity[a.student.id] ? new Date(lastActivity[a.student.id]).getTime() : 0;
            const tb = lastActivity[b.student.id] ? new Date(lastActivity[b.student.id]).getTime() : 0;
            return tb - ta;
          });
        setAllStudentsByActivity(list);
        setStudentLastActivity(lastActivity);
      } catch (err) {
        console.error('Error fetching all students by activity:', err);
        setAllStudentsByActivity([]);
      } finally {
        setLoadingAllByActivity(false);
      }
    })();
  }, [sortByLastActivity, teachers]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
        Yükleniyor...
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <StudentReadOnlyDetail
        student={selectedStudent}
        teacher={selectedTeacher}
        onBack={() => { setSelectedStudent(null); setSelectedTeacher(null); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
        <strong>Salt okunur görünüm.</strong> Öğretmeni seçip öğrencisine tıklayarak o öğrencinin tüm ilerleme verilerini (hikayeler, seviye/adım, puan, süre, aktiviteler) görüntüleyebilirsiniz. Hiçbir veri düzenlenemez.
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrele</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Okul</label>
            <select
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
            >
              <option value="all">Tümü</option>
              {schoolNames.map((s) => (
                <option key={s} value={s}>{s} ({studentCountsBySchool[s] || 0})</option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Öğretmen</label>
            <select
              value={filterTeacher}
              onChange={(e) => {
                setFilterTeacher(e.target.value);
                if (e.target.value !== 'all') setExpandedTeacherId(e.target.value);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
            >
              <option value="all">Tümü</option>
              {teachersFilteredBySchool.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name}
                  {(t.school_name && t.school_name.trim()) ? ` (${t.school_name})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Öğrenci ara</label>
            <input
              type="text"
              value={filterStudentSearch}
              onChange={(e) => setFilterStudentSearch(e.target.value)}
              placeholder="Ad veya soyad ile ara..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400"
            />
          </div>
          <div className="min-w-[220px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Sırala</label>
            <select
              value={sortByLastActivity ? 'last_activity' : 'default'}
              onChange={(e) => setSortByLastActivity(e.target.value === 'last_activity')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
            >
              <option value="default">Varsayılan (okul → öğretmen → öğrenci)</option>
              <option value="last_activity">Son işlem yapana göre (tek liste, en son aktif en üstte)</option>
            </select>
          </div>
          {(filterSchool !== 'all' || filterTeacher !== 'all' || filterStudentSearch.trim() || sortByLastActivity) && (
            <button
              type="button"
              onClick={() => {
                setFilterSchool('all');
                setFilterTeacher('all');
                setFilterStudentSearch('');
                setSortByLastActivity(false);
                setExpandedTeacherId(null);
              }}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Filtreleri temizle
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {sortByLastActivity ? (
          <>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Son işlem yapana göre öğrenciler</h2>
              <p className="text-sm text-gray-600 mt-1">Tüm öğrenciler tek listede; en son işlem yapan en üstte. Satıra tıklayarak detay açılır.</p>
            </div>
            {loadingAllByActivity ? (
              <div className="px-6 py-12 flex flex-col items-center gap-3 text-gray-500">
                <div className="w-10 h-10 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin" />
                <p>Son işleme göre listeleniyor…</p>
              </div>
            ) : (() => {
              const teacherSchool = (t: any) => (t?.school_name && String(t.school_name).trim()) || NO_SCHOOL_LABEL;
              const flatFiltered = allStudentsByActivity.filter(({ student, teacher }) => {
                if (filterSchool !== 'all' && teacherSchool(teacher) !== filterSchool) return false;
                if (filterTeacher !== 'all' && teacher?.id !== filterTeacher) return false;
                if (!studentMatchesSearch(student)) return false;
                return true;
              });
              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Öğrenci</th>
                        <th className="px-4 py-3">Öğretmen</th>
                        <th className="px-4 py-3">Okul</th>
                        <th className="px-4 py-3">Son işlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {flatFiltered.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            {allStudentsByActivity.length === 0 ? 'Öğrenci bulunamadı.' : 'Filtreye uyan öğrenci yok.'}
                          </td>
                        </tr>
                      ) : (
                        flatFiltered.map(({ student, teacher }, idx) => (
                          <tr
                            key={student.id}
                            className="hover:bg-purple-50 cursor-pointer transition-colors"
                            onClick={() => handleSelectStudent(student, teacher)}
                          >
                            <td className="px-4 py-3 text-gray-400 font-medium">{idx + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {student.first_name} {student.last_name}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {teacher ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || '–' : '–'}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {teacher ? teacherSchool(teacher) : '–'}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-sm">
                              {studentLastActivity[student.id]
                                ? new Date(studentLastActivity[student.id]).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '–'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </>
        ) : (
          <>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Okullara göre öğretmenler ve öğrenciler</h2>
              <p className="text-sm text-gray-600 mt-1">Okul → Öğretmen → Öğrenci. Öğrenciye tıklayınca detay sayfası açılır.</p>
            </div>

            {teachers.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">Öğretmen bulunamadı.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {schoolNames
                  .filter((school) => filterSchool === 'all' || filterSchool === school)
                  .map((school) => {
                  const schoolTeachers = teachersBySchool[school] || [];
                  const visibleTeachers =
                    filterTeacher !== 'all'
                      ? schoolTeachers.filter((t: any) => t.id === filterTeacher)
                      : schoolTeachers;
                  if (visibleTeachers.length === 0) return null;

                  return (
                    <div key={school} className="bg-white">
                      <div className="px-6 py-3 bg-slate-100 border-b border-slate-200">
                        <h3 className="text-base font-semibold text-slate-800">🏫 {school} ({studentCountsBySchool[school] || 0} ogrenci)</h3>
                      </div>
                      <ul className="divide-y divide-gray-100">
                        {visibleTeachers.map((teacher: any) => {
                          const matchingStudents = (teacherStudents[teacher.id] || []).filter((s: any) => studentMatchesSearch(s));
                          const forceOpen = filterStudentSearch.trim().length > 0 || filterTeacher === teacher.id;
                          const showTeacher = !filterStudentSearch.trim() || loadingStudents === teacher.id || matchingStudents.length > 0 || !teacherStudents[teacher.id];

                          if (!showTeacher) return null;

                          return (
                          <li key={teacher.id}>
                            <button
                              type="button"
                              onClick={() => handleToggleTeacher(teacher.id)}
                              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-medium text-gray-900">
                                {teacher.first_name} {teacher.last_name}
                              </span>
                              <span className="text-gray-400">
                                {expandedTeacherId === teacher.id || forceOpen ? '▼' : '▶'}
                              </span>
                            </button>
                            {(expandedTeacherId === teacher.id || forceOpen) && (
                              <div className="bg-gray-50 px-6 pb-4">
                                {loadingStudents === teacher.id ? (
                                  <p className="py-3 text-gray-500 text-sm">Öğrenciler yükleniyor...</p>
                                ) : (
                                  <ul className="space-y-1">
                                    {matchingStudents.map((student: any) => (
                                      <li key={student.id}>
                                        <button
                                          type="button"
                                          onClick={() => handleSelectStudent(student, teacher)}
                                          className="w-full text-left px-4 py-3 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-gray-800 font-medium"
                                        >
                                          {student.first_name} {student.last_name}
                                        </button>
                                      </li>
                                    ))}
                                    {matchingStudents.length === 0 &&
                                      !loadingStudents && (
                                        <p className="py-2 text-gray-500 text-sm">
                                          {filterStudentSearch.trim()
                                            ? 'Bu öğretmende arama kriterine uyan öğrenci yok.'
                                            : 'Bu öğretmene kayıtlı öğrenci yok.'}
                                        </p>
                                      )}
                                  </ul>
                                )}
                              </div>
                            )}
                          </li>
                        )})}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Öğrenci detayı: hikayeler (kilit/açık), seviye-adım, puan, süre, aktiviteler, okuma hedefleri. Salt okunur. */
function StudentReadOnlyDetail({
  student,
  teacher,
  onBack,
}: {
  student: any;
  teacher: any;
  onBack: () => void;
}) {
  const [stories, setStories] = useState<any[]>([]);
  const [progressList, setProgressList] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [readingLogs, setReadingLogs] = useState<any[]>([]);
  const [readingGoals, setReadingGoals] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [stepCompletions, setStepCompletions] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [studentActions, setStudentActions] = useState<any[]>([]);
  const [apiLogs, setApiLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableErrors, setTableErrors] = useState<Record<string, string>>({});
  const [selectedStoryFilter, setSelectedStoryFilter] = useState<'all' | string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d'>('all');
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [detailReportTab, setDetailReportTab] = useState<'timing' | 'scores' | 'actions' | 'api'>('timing');
  const [expandedApiLogId, setExpandedApiLogId] = useState<string | null>(null);
  const [unlockLoadingDetail, setUnlockLoadingDetail] = useState<number | null>(null);

  const refreshProgress = async () => {
    const progressRes = await getStudentProgress(student.id);
    if (!progressRes.error) setProgressList(progressRes.data || []);
  };

  const handleUnlockStoryDetail = async (storyIdToUnlock: number) => {
    const prevStoryId = storyIdToUnlock - 1;
    if (prevStoryId < 1) return;
    setUnlockLoadingDetail(storyIdToUnlock);
    try {
      await completeStory(student.id, prevStoryId);
      await refreshProgress();
    } finally {
      setUnlockLoadingDetail(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [storiesRes, progressRes, logsRes, readLogsRes, goalsRes, sessionsRes,
               stepCompRes, scoresRes, actionsRes, apiLogsRes] = await Promise.all([
          getStories(),
          getStudentProgress(student.id),
          supabase.from('activity_logs').select('*').eq('student_id', student.id).order('timestamp', { ascending: false }).limit(200),
          supabase.from('reading_logs').select('*').eq('student_id', student.id).order('timestamp', { ascending: false }).limit(100),
          supabase.from('reading_goals').select('*').eq('student_id', student.id).order('timestamp', { ascending: false }).limit(50),
          supabase.from('sessions').select('*').eq('student_id', student.id).order('started_at', { ascending: false }).limit(50),
          supabase.from('step_completions').select('*').eq('student_id', student.id).order('started_at', { ascending: false }).limit(200),
          supabase.from('scores').select('*').eq('student_id', student.id).order('story_id', { ascending: true }).limit(200),
          supabase.from('student_actions').select('*').eq('student_id', student.id).order('timestamp', { ascending: false }).limit(200),
          supabase.from('api_logs').select('*').eq('student_id', student.id).order('timestamp', { ascending: false }).limit(200),
        ]);

        const errs: Record<string, string> = {};
        if (!storiesRes.error) setStories(storiesRes.data || []);
        else errs.stories = storiesRes.error.message;
        if (!progressRes.error) setProgressList(progressRes.data || []);
        else errs.progress = progressRes.error.message;
        if (!logsRes.error) setActivityLogs(logsRes.data || []);
        else errs.activity_logs = logsRes.error.message;
        if (!readLogsRes.error) setReadingLogs(readLogsRes.data || []);
        else errs.reading_logs = readLogsRes.error.message;
        if (!goalsRes.error) setReadingGoals(goalsRes.data || []);
        else errs.reading_goals = goalsRes.error.message;
        if (!sessionsRes.error) setSessions(sessionsRes.data || []);
        else errs.sessions = sessionsRes.error.message;
        if (!stepCompRes.error) setStepCompletions(stepCompRes.data || []);
        else errs.step_completions = stepCompRes.error.message;
        if (!scoresRes.error) setScores(scoresRes.data || []);
        else errs.scores = scoresRes.error.message;
        if (!actionsRes.error) setStudentActions(actionsRes.data || []);
        else errs.student_actions = actionsRes.error.message;
        if (!apiLogsRes.error) setApiLogs(apiLogsRes.data || []);
        else errs.api_logs = apiLogsRes.error.message;
        setTableErrors(errs);
      } catch (err) {
        console.error('Error loading student detail:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [student.id]);

  const stats = progressList.length
    ? {
        total: progressList.length,
        completed: progressList.filter((p: any) => p.is_completed).length,
        totalPoints: progressList.reduce((acc: number, p: any) => acc + (p.points || 0), 0),
      }
    : null;

  const completionRate = stats
    ? Math.round((stats.completed / Math.max(stats.total, 1)) * 100)
    : 0;

  const latestGoal = readingGoals.length ? readingGoals[0] : null;

  const latestGoalLog = latestGoal
    ? readingLogs.find(
        (r: any) =>
          r.story_id === latestGoal.story_id &&
          r.level === latestGoal.level
      )
    : null;

  const latestGoalStatus = latestGoal && latestGoalLog
    ? {
        storyId: latestGoal.story_id,
        level: latestGoal.level,
        goalWpm: latestGoal.selected_wpm,
        actualWpm: latestGoalLog.wpm,
        achieved: latestGoalLog.wpm >= latestGoal.selected_wpm,
        diff: latestGoalLog.wpm - latestGoal.selected_wpm,
      }
    : null;

  const latestLogByStoryLevel: Record<string, any> = {};
  readingLogs.forEach((r: any) => {
    const key = `${r.story_id}-${r.level}`;
    if (!latestLogByStoryLevel[key]) {
      latestLogByStoryLevel[key] = r;
    }
  });

  const applyTimeFilter = (dateStr?: string | null) => {
    if (timeFilter === 'all') return true;
    if (!dateStr) return false;
    const ts = new Date(dateStr).getTime();
    if (Number.isNaN(ts)) return false;
    const now = Date.now();
    const diffDays = (now - ts) / (1000 * 60 * 60 * 24);
    if (timeFilter === '7d') return diffDays <= 7;
    if (timeFilter === '30d') return diffDays <= 30;
    return true;
  };

  const applyStoryFilter = (storyId?: number | null) => {
    if (selectedStoryFilter === 'all') return true;
    if (storyId == null) return false;
    return String(storyId) === selectedStoryFilter;
  };

  const filteredActivityLogs = activityLogs.filter(
    (log: any) => applyTimeFilter(log.timestamp) && applyStoryFilter(log.story_id)
  );
  const filteredReadingGoals = readingGoals.filter(
    (g: any) => applyTimeFilter(g.timestamp) && applyStoryFilter(g.story_id)
  );
  const filteredReadingLogs = readingLogs.filter(
    (r: any) => applyTimeFilter(r.timestamp) && applyStoryFilter(r.story_id)
  );
  const filteredSessions = sessions.filter(
    (s: any) => applyTimeFilter(s.started_at) && applyStoryFilter(s.story_id)
  );

  const getActivityTypeStyle = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('error') || t.includes('fail') || t.includes('exception')) {
      return 'bg-red-100 text-red-700';
    }
    if (t.includes('complete') || t.includes('finish') || t.includes('success')) {
      return 'bg-green-100 text-green-700';
    }
    if (t.includes('start') || t.includes('begin')) {
      return 'bg-blue-100 text-blue-700';
    }
    return 'bg-purple-100 text-purple-700';
  };

  const isStoryUnlocked = (storyId: number) => {
    if (storyId === 1) return true;
    const prev = progressList.find((p: any) => p.story_id === storyId - 1);
    return prev?.is_completed === true || (
      Array.isArray(prev?.completed_levels) && prev.completed_levels.includes(5)
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-12 flex flex-col items-center justify-center gap-5">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
          <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Öğrenci verileri yükleniyor</p>
          <p className="text-sm text-gray-400 mt-1">Tüm tablolar çekiliyor, lütfen bekleyin…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
        >
          ← Geri
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {student.first_name} {student.last_name}
          </h1>
          <p className="text-gray-600">
            Öğretmen: {teacher?.first_name} {teacher?.last_name}
            {teacher?.school_name && ` (${teacher.school_name})`}
          </p>
          {student.created_at && (
            <p className="text-sm text-gray-500 mt-0.5">
              Kayıt tarihi: {new Date(student.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Hikaye ilerlemesi</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.completed} / {stats.total} tamamlandı
            </p>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">%{completionRate} tamamlandı</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Toplam puan</p>
            <p className="text-xl font-semibold text-gray-900">{stats.totalPoints}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Oturum sayısı (son 30)</p>
            <p className="text-xl font-semibold text-gray-900">{sessions.length}</p>
          </div>
          {latestGoalStatus && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Son okuma hedefi durumu</p>
              <p className="mt-1 text-sm text-gray-700">
                Hikaye {latestGoalStatus.storyId} · Seviye {latestGoalStatus.level}
              </p>
              <p className="mt-1 text-sm">
                <span className="text-gray-500">Hedef:</span>{' '}
                <span className="font-semibold">{latestGoalStatus.goalWpm} sözcük/dk</span>
                <span className="ml-2 text-gray-500">Gerçek:</span>{' '}
                <span className="font-semibold">{latestGoalStatus.actualWpm} sözcük/dk</span>
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  latestGoalStatus.achieved ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {latestGoalStatus.achieved
                  ? `Hedefe ulaştı (+${latestGoalStatus.diff} sözcük/dk)`
                  : `Hedefin ${Math.abs(latestGoalStatus.diff)} sözcük/dk ${
                      latestGoalStatus.diff < 0 ? 'altında' : 'üstünde'
                    }`}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow px-4 py-3 flex flex-wrap items-center gap-4 border border-purple-100">
        <div>
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
            Filtreler
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Hikaye:</span>
          <select
            value={selectedStoryFilter}
            onChange={(e) => setSelectedStoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="all">Tüm hikayeler</option>
            {stories.map((story) => (
              <option key={story.id} value={String(story.id)}>
                {story.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Zaman:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as 'all' | '7d' | '30d')}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="all">Tümü</option>
            <option value="7d">Son 7 gün</option>
            <option value="30d">Son 30 gün</option>
          </select>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          {selectedStoryFilter === 'all'
            ? 'Tüm hikayeler'
            : `Hikaye: ${
                stories.find((s) => String(s.id) === selectedStoryFilter)?.title || selectedStoryFilter
              }`}{' '}
          ·{' '}
          {timeFilter === 'all'
            ? 'Tüm zaman'
            : timeFilter === '7d'
            ? 'Son 7 gün'
            : 'Son 30 gün'}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Hikayeler – Kilid / Seviye / Adım / Puan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Hikaye</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Kilit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Seviye</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Adım</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Puan</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Tamamlanan seviyeler</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Durum</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stories.map((story) => {
                const progress = progressList.find((p: any) => p.story_id === story.id);
                const unlocked = isStoryUnlocked(story.id);
                return (
                  <tr key={story.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{story.title}</td>
                    <td className="px-4 py-3 text-sm">
                      {unlocked ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          Açık
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Kilitli
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{progress ? progress.current_level : '–'}</td>
                    <td className="px-4 py-3 text-sm">{progress ? progress.current_step : '–'}</td>
                    <td className="px-4 py-3 text-sm">{progress ? (progress.points || 0) : '–'}</td>
                    <td className="px-4 py-3 text-sm">
                      {progress?.completed_levels?.length ? progress.completed_levels.join(', ') : '–'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {progress?.is_completed ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          Tamamlandı
                        </span>
                      ) : progress ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700">
                          Devam ediyor
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">–</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {!unlocked && story.id > 1 && (
                        <button
                          type="button"
                          onClick={() => handleUnlockStoryDetail(story.id)}
                          disabled={unlockLoadingDetail === story.id}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded disabled:opacity-50"
                        >
                          {unlockLoadingDetail === story.id ? '...' : 'Kilit aç'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Son aktiviteler (en yeni 80)</h2>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredActivityLogs.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Aktivite kaydı yok.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredActivityLogs.slice(0, 30).map((log: any) => (
                  <li
                    key={log.id}
                    className="px-6 py-2 text-sm text-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                  >
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${getActivityTypeStyle(
                          log.activity_type
                        )}`}
                      >
                        {log.activity_type}
                      </span>
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {log.story_id != null && `Hikaye ${log.story_id}`}
                        {log.level_id != null && ` · Seviye ${log.level_id}`}
                        {log.step_number != null && ` · Adım ${log.step_number}`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Okuma hedefleri (son 30)</h2>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredReadingGoals.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Okuma hedefi kaydı yok.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredReadingGoals.slice(0, 20).map((g: any) => {
                  const key = `${g.story_id}-${g.level}`;
                  const goalLog = latestLogByStoryLevel[key];
                  const achieved = goalLog && goalLog.wpm >= g.selected_wpm;
                  return (
                  <li key={g.id} className="px-6 py-2 text-sm text-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <p className="font-medium text-gray-800">
                          Hikaye {g.story_id} · Seviye {g.level}
                        </p>
                        <p className="text-xs text-gray-600">
                          Hedef: <span className="font-semibold">{g.selected_wpm} sözcük/dk</span>
                          {g.base_wpm != null && (
                            <>
                              {' '}(
                              Temel: <span className="font-semibold">{g.base_wpm} sözcük/dk</span>
                              {g.increase_percentage != null && (
                                <>
                                  {', '}+{g.increase_percentage}%
                                </>
                              )}
                              )
                            </>
                          )}
                        </p>
                        {goalLog && (
                          <p
                            className={`mt-0.5 text-xs font-semibold ${
                              achieved ? 'text-green-600' : 'text-orange-600'
                            }`}
                          >
                            Son okuma: {goalLog.wpm} sözcük/dk (
                            {achieved ? 'Hedefe ulaştı' : 'Hedefin altında'})
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(g.timestamp).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Okuma logları (WPM / doğru sözcük – son 50)</h2>
        </div>
        <div className="max-h-64 overflow-y-auto overflow-x-auto">
          {filteredReadingLogs.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">Okuma logu yok.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Hikaye</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Seviye</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">WPM</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Doğru</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {filteredReadingLogs.slice(0, 25).map((r: any) => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="px-4 py-2 text-sm">{r.story_id}</td>
                    <td className="px-4 py-2 text-sm">{r.level}</td>
                    <td className="px-4 py-2 text-sm">{r.wpm}</td>
                    <td className="px-4 py-2 text-sm">{r.correct_words}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{new Date(r.timestamp).toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Oturumlar (son 30)</h2>
        </div>
        <div className="max-h-48 overflow-y-auto overflow-x-auto">
          {filteredSessions.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">Oturum kaydı yok.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Hikaye</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Başlangıç</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Bitiş</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Aktif</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.slice(0, 15).map((s: any) => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="px-4 py-2 text-sm">{s.story_id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{s.started_at ? new Date(s.started_at).toLocaleString('tr-TR') : '–'}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{s.ended_at ? new Date(s.ended_at).toLocaleString('tr-TR') : '–'}</td>
                    <td className="px-4 py-2 text-sm">{s.is_active ? 'Evet' : 'Hayır'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─────────── DETAYLI RAPOR ─────────── */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-indigo-100">
        <button
          type="button"
          onClick={() => setShowDetailedReport((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 bg-indigo-50 hover:bg-indigo-100 transition-colors text-left"
        >
          <div>
            <h2 className="text-lg font-bold text-indigo-800">Detaylı Rapor</h2>
            <p className="text-xs text-indigo-600 mt-0.5">
              Adım bazlı süre · Puan dağılımı · Öğrenci aksiyonları · Mikrofon / API logları
            </p>
          </div>
          <span className="text-indigo-600 text-xl">{showDetailedReport ? '▲' : '▼'}</span>
        </button>

        {showDetailedReport && (
          <div className="p-4 space-y-4">
            {/* Tab seçici */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
              {([
                { id: 'timing',  label: '⏱ Adım Süresi' },
                { id: 'scores',  label: '🏅 Puan Raporu' },
                { id: 'actions', label: '🖱 Aksiyonlar' },
                { id: 'api',     label: '📡 API / Mikrofon Logları' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDetailReportTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    detailReportTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── TAB: Adım Süresi ── */}
            {detailReportTab === 'timing' && (() => {
              if (stepCompletions.length === 0) {
                return (
                  <p className="text-gray-500 text-sm py-4 text-center">Adım tamamlanma kaydı yok.</p>
                );
              }

              const durSec = (sc: any) => {
                const s = sc.started_at ? new Date(sc.started_at).getTime() : null;
                const e = sc.completed_at ? new Date(sc.completed_at).getTime() : null;
                return s && e ? Math.round((e - s) / 1000) : null;
              };
              const durLabel = (sec: number | null) => {
                if (sec == null) return '–';
                return sec >= 60 ? `${Math.floor(sec / 60)} dk ${sec % 60} sn` : `${sec} sn`;
              };

              // Group: story → level → steps
              const byStory: Record<number, Record<number, any[]>> = {};
              stepCompletions.forEach((sc: any) => {
                const sid = sc.story_id ?? 0;
                const lv  = sc.level ?? 0;
                if (!byStory[sid]) byStory[sid] = {};
                if (!byStory[sid][lv]) byStory[sid][lv] = [];
                byStory[sid][lv].push(sc);
              });

              return (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500">
                    Sarı = tamamlanmamış adım, yeşil = tamamlandı, turuncu arka plan = 10 dk'dan uzun sürdü.
                  </p>
                  {Object.entries(byStory)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([storyIdStr, levelMap]) => {
                      const storyId = Number(storyIdStr);
                      const storyTitle = stories.find((s) => s.id === storyId)?.title || `Hikaye ${storyId}`;
                      const allSteps = Object.values(levelMap).flat();
                      const completedSteps = allSteps.filter((sc: any) => sc.is_completed).length;
                      const totalSecAll = allSteps.reduce((acc: number, sc: any) => {
                        const d = durSec(sc);
                        return d != null ? acc + d : acc;
                      }, 0);

                      return (
                        <div key={storyId} className="rounded-xl border border-purple-200 overflow-hidden">
                          {/* Hikaye başlığı */}
                          <div className="flex items-center justify-between px-4 py-3 bg-purple-50 border-b border-purple-200">
                            <div className="flex items-center gap-3">
                              <span className="text-base font-bold text-purple-800">{storyTitle}</span>
                              <span className="text-xs text-purple-500 font-medium">
                                {completedSteps}/{allSteps.length} adım tamamlandı
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                              Toplam: {durLabel(totalSecAll)}
                            </span>
                          </div>

                          {/* Seviyeler */}
                          <div className="divide-y divide-purple-100">
                            {Object.entries(levelMap)
                              .sort(([a], [b]) => Number(a) - Number(b))
                              .map(([lvStr, steps]) => {
                                const lv = Number(lvStr);
                                const lvSec = steps.reduce((acc: number, sc: any) => {
                                  const d = durSec(sc);
                                  return d != null ? acc + d : acc;
                                }, 0);
                                const lvCompleted = steps.filter((sc: any) => sc.is_completed).length;

                                return (
                                  <div key={lv} className="pl-4">
                                    {/* Seviye başlığı */}
                                    <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 border-b border-indigo-100">
                                      <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                                          {lv}
                                        </span>
                                        <span className="text-sm font-semibold text-indigo-800">
                                          Seviye {lv}
                                        </span>
                                        <span className="text-xs text-indigo-400">
                                          {lvCompleted}/{steps.length} adım
                                        </span>
                                      </div>
                                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                                        {durLabel(lvSec)}
                                      </span>
                                    </div>

                                    {/* Adımlar */}
                                    <div className="divide-y divide-gray-100">
                                      {steps
                                        .sort((a: any, b: any) => (a.step ?? 0) - (b.step ?? 0))
                                        .map((sc: any) => {
                                          const sec = durSec(sc);
                                          const warn = sec != null && sec > 600;
                                          return (
                                            <div
                                              key={sc.id}
                                              className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 ${
                                                warn ? 'bg-orange-50' : 'hover:bg-gray-50'
                                              }`}
                                            >
                                              {/* Adım numarası */}
                                              <div className="flex items-center gap-2 min-w-[90px]">
                                                <span className="w-5 h-5 rounded bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center">
                                                  {sc.step ?? '?'}
                                                </span>
                                                <span className="text-xs font-medium text-gray-700">Adım {sc.step ?? '?'}</span>
                                              </div>

                                              {/* Durum */}
                                              {sc.is_completed ? (
                                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                  Tamamlandı
                                                </span>
                                              ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                                  Yarım
                                                </span>
                                              )}

                                              {/* Süre */}
                                              <span className={`text-xs font-bold min-w-[70px] ${warn ? 'text-orange-600' : 'text-gray-700'}`}>
                                                {durLabel(sec)}
                                                {warn && <span className="ml-1" title="10 dk'dan uzun sürdü">⚠️</span>}
                                              </span>

                                              {/* Zaman aralığı */}
                                              <span className="text-xs text-gray-400 ml-auto text-right">
                                                {sc.started_at ? new Date(sc.started_at).toLocaleString('tr-TR') : '–'}
                                                {sc.completed_at && (
                                                  <> → {new Date(sc.completed_at).toLocaleString('tr-TR')}</>
                                                )}
                                              </span>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })()}

            {/* ── TAB: Puan Raporu ── */}
            {detailReportTab === 'scores' && (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Hikaye, seviye ve adım bazlı kazanılan puanlar ve puan türleri.
                  <span className="ml-1 text-indigo-500">
                    (Veriler <code className="bg-gray-100 px-1 rounded">scores</code> tablosundan çekilir; <code className="bg-gray-100 px-1 rounded">saveScore()</code> çağrılarıyla dolar.)
                  </span>
                </p>
                {tableErrors.scores && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    <strong>Tablo hatası:</strong> {tableErrors.scores}
                  </div>
                )}
                {scores.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-gray-500 text-sm">Puan kaydı yok.</p>
                    {!tableErrors.scores && (
                      <p className="text-gray-400 text-xs mt-1">
                        Bu öğrenci için henüz <code>scores</code> tablosuna kayıt düşmemiş olabilir.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs text-gray-600 uppercase">Hikaye</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-600 uppercase">Seviye</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-600 uppercase">Adım</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-600 uppercase">Puan Türü</th>
                          <th className="px-3 py-2 text-right text-xs text-gray-600 uppercase">Puan</th>
                          <th className="px-3 py-2 text-right text-xs text-gray-600 uppercase">Maks</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-600 uppercase">Tarih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((sc: any) => {
                          const storyTitle = stories.find((s) => s.id === sc.story_id)?.title || `Hikaye ${sc.story_id}`;
                          const pct = sc.max_points ? Math.round((sc.points / sc.max_points) * 100) : null;
                          return (
                            <tr key={sc.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-3 py-2 text-xs text-gray-800 font-medium max-w-[160px] truncate">{storyTitle}</td>
                              <td className="px-3 py-2 text-xs text-center">{sc.level ?? '–'}</td>
                              <td className="px-3 py-2 text-xs text-center">{sc.step ?? '–'}</td>
                              <td className="px-3 py-2 text-xs">
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
                                  {sc.score_type || '–'}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-xs text-right font-bold text-indigo-700">{sc.points ?? 0}</td>
                              <td className="px-3 py-2 text-xs text-right text-gray-500">
                                {sc.max_points ?? '–'}
                                {pct != null && (
                                  <span className={`ml-1 text-xs font-semibold ${pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    (%{pct})
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-xs text-gray-500">
                                {sc.created_at ? new Date(sc.created_at).toLocaleString('tr-TR') : '–'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={4} className="px-3 py-2 text-xs font-bold text-gray-700">Toplam</td>
                          <td className="px-3 py-2 text-xs text-right font-bold text-indigo-700">
                            {scores.reduce((s: number, sc: any) => s + (sc.points || 0), 0)}
                          </td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Aksiyonlar ── */}
            {detailReportTab === 'actions' && (() => {
              if (studentActions.length === 0) {
                return (
                  <div className="py-6 text-center">
                    <p className="text-gray-500 text-sm">Aksiyon kaydı yok.</p>
                    {tableErrors.student_actions && (
                      <p className="text-red-500 text-xs mt-1">Hata: {tableErrors.student_actions}</p>
                    )}
                    {!tableErrors.student_actions && (
                      <p className="text-gray-400 text-xs mt-1">
                        Bu öğrenci için <code>student_actions</code> tablosuna henüz kayıt düşmemiş olabilir.
                      </p>
                    )}
                  </div>
                );
              }

              // Group: story → level → step → actions[]
              const byStory: Record<number, Record<number, Record<number, any[]>>> = {};
              studentActions.forEach((a: any) => {
                const sid = a.story_id ?? 0;
                const lv  = a.level ?? 0;
                const st  = a.step ?? 0;
                if (!byStory[sid]) byStory[sid] = {};
                if (!byStory[sid][lv]) byStory[sid][lv] = {};
                if (!byStory[sid][lv][st]) byStory[sid][lv][st] = [];
                byStory[sid][lv][st].push(a);
              });

              return (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500">
                    Öğrencinin her adımda aldığı aksiyonlar. Renkler aksiyon türünü gösterir.
                  </p>
                  {Object.entries(byStory)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([storyIdStr, levelMap]) => {
                      const storyId = Number(storyIdStr);
                      const storyTitle = stories.find((s) => s.id === storyId)?.title || `Hikaye ${storyId}`;
                      const totalActions = Object.values(levelMap).flatMap(lv => Object.values(lv).flat()).length;

                      return (
                        <div key={storyId} className="rounded-xl border border-teal-200 overflow-hidden">
                          {/* Hikaye başlığı */}
                          <div className="flex items-center justify-between px-4 py-3 bg-teal-50 border-b border-teal-200">
                            <span className="text-base font-bold text-teal-800">{storyTitle}</span>
                            <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                              {totalActions} aksiyon
                            </span>
                          </div>

                          <div className="divide-y divide-teal-100">
                            {Object.entries(levelMap)
                              .sort(([a], [b]) => Number(a) - Number(b))
                              .map(([lvStr, stepMap]) => {
                                const lv = Number(lvStr);
                                const lvTotal = Object.values(stepMap).flat().length;

                                return (
                                  <div key={lv} className="pl-4">
                                    {/* Seviye başlığı */}
                                    <div className="flex items-center justify-between px-3 py-2 bg-teal-50/60 border-b border-teal-100">
                                      <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                                          {lv}
                                        </span>
                                        <span className="text-sm font-semibold text-teal-800">Seviye {lv}</span>
                                      </div>
                                      <span className="text-xs text-teal-500">{lvTotal} aksiyon</span>
                                    </div>

                                    {/* Adımlar */}
                                    <div className="divide-y divide-gray-100">
                                      {Object.entries(stepMap)
                                        .sort(([a], [b]) => Number(a) - Number(b))
                                        .map(([stStr, actions]) => {
                                          const st = Number(stStr);
                                          return (
                                            <div key={st} className="pl-4 py-2">
                                              {/* Adım başlığı */}
                                              <div className="flex items-center gap-2 mb-2">
                                                <span className="w-5 h-5 rounded bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center">
                                                  {st}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-600">Adım {st}</span>
                                                <span className="text-xs text-gray-400">({actions.length} aksiyon)</span>
                                              </div>

                                              {/* Aksiyon listesi */}
                                              <div className="space-y-1 pl-7">
                                                {(actions as any[])
                                                  .slice()
                                                  .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
                                                  .map((a: any) => {
                                                    const audioUrl = a.action_data?.audio_storage_url ?? null;
                                                    const transcript = a.action_data?.student_transcript ?? null;
                                                    const displayData = a.action_data
                                                      ? Object.fromEntries(
                                                          Object.entries(a.action_data).filter(
                                                            ([k]) => k !== 'audio_storage_url'
                                                          )
                                                        )
                                                      : null;
                                                    const dataStr = displayData && Object.keys(displayData).length > 0
                                                      ? JSON.stringify(displayData, null, 2)
                                                      : null;
                                                    return (
                                                      <details key={a.id} className="group">
                                                        <summary className="flex flex-wrap items-center gap-2 cursor-pointer list-none">
                                                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getActivityTypeStyle(a.action_type)}`}>
                                                            {a.action_type || '–'}
                                                          </span>
                                                          <span className="text-xs text-gray-400">
                                                            {a.timestamp ? new Date(a.timestamp).toLocaleString('tr-TR') : '–'}
                                                          </span>
                                                          {audioUrl && (
                                                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">🎤 ses kaydı var</span>
                                                          )}
                                                          {transcript && (
                                                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">📝 transcript</span>
                                                          )}
                                                          {(dataStr || audioUrl) && (
                                                            <span className="text-xs text-indigo-500 group-open:hidden">▶ detay</span>
                                                          )}
                                                        </summary>
                                                        <div className="mt-1 ml-2 space-y-1">
                                                          {audioUrl && (
                                                            <div className="bg-green-50 border border-green-200 rounded p-2">
                                                              <p className="text-[10px] text-green-700 font-semibold mb-1">🎤 Öğrenci ses kaydı</p>
                                                              <audio
                                                                controls
                                                                src={audioUrl}
                                                                className="w-full h-7"
                                                                style={{ height: '28px' }}
                                                              />
                                                            </div>
                                                          )}
                                                          {transcript && (
                                                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                                              <p className="text-[10px] text-blue-700 font-semibold mb-0.5">📝 Transcript (STT)</p>
                                                              <p className="text-[11px] text-gray-800 italic">"{transcript}"</p>
                                                            </div>
                                                          )}
                                                          {dataStr && (
                                                            <pre className="text-[10px] bg-gray-50 border border-gray-200 rounded p-2 whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                                                              {dataStr}
                                                            </pre>
                                                          )}
                                                        </div>
                                                      </details>
                                                    );
                                                  })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })()}

            {/* ── TAB: API / Mikrofon Logları ── */}
            {detailReportTab === 'api' && (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Mikrofondan API'ye gönderilen istekler, gelen yanıtlar (başarılı ve hatalı, 4xx/5xx dahil).
                  Her satıra tıklayarak istek ve yanıt detayını görüntüleyebilirsiniz.
                  <span className="ml-1 text-indigo-500">
                    (Veriler <code className="bg-gray-100 px-1 rounded">api_logs</code> tablosundan çekilir; <code className="bg-gray-100 px-1 rounded">logApiCall()</code> ile dolar.)
                  </span>
                </p>
                {tableErrors.api_logs && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    <strong>Tablo hatası:</strong> {tableErrors.api_logs}
                  </div>
                )}
                {apiLogs.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-gray-500 text-sm">API log kaydı yok.</p>
                    {!tableErrors.api_logs && (
                      <p className="text-gray-400 text-xs mt-1">
                        Bu öğrenci için <code>api_logs</code> tablosuna henüz kayıt düşmemiş olabilir.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {apiLogs.map((log: any) => {
                      const isError = log.response_status == null || log.response_status >= 400;
                      const isServerError = log.response_status != null && log.response_status >= 500;
                      const isClientError = log.response_status != null && log.response_status >= 400 && log.response_status < 500;
                      const isOk = log.response_status != null && log.response_status < 400;
                      const storyTitle = stories.find((s) => s.id === log.story_id)?.title || (log.story_id ? `Hikaye ${log.story_id}` : '–');
                      const isExpanded = expandedApiLogId === log.id;
                      return (
                        <div
                          key={log.id}
                          className={`rounded-lg border ${
                            isServerError
                              ? 'border-red-300 bg-red-50'
                              : isClientError
                              ? 'border-orange-300 bg-orange-50'
                              : isOk
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedApiLogId(isExpanded ? null : log.id)}
                            className="w-full flex flex-wrap items-center gap-3 px-4 py-3 text-left"
                          >
                            {/* Status badge */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[44px] text-center ${
                                isServerError
                                  ? 'bg-red-200 text-red-800'
                                  : isClientError
                                  ? 'bg-orange-200 text-orange-800'
                                  : isOk
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {log.response_status ?? 'N/A'}
                            </span>
                            {/* Method */}
                            <span className="text-xs font-mono font-semibold text-gray-700 bg-gray-200 px-1.5 py-0.5 rounded">
                              {log.request_method || 'POST'}
                            </span>
                            {/* Endpoint */}
                            <span className="text-xs text-gray-700 font-mono truncate max-w-[260px]">
                              {log.api_endpoint || '–'}
                            </span>
                            {/* Story / Level / Step */}
                            <span className="text-xs text-gray-500">
                              {storyTitle} · Sv.{log.level ?? '–'} Adım{log.step ?? '–'}
                            </span>
                            {/* Response time */}
                            {log.response_time_ms != null && (
                              <span className={`text-xs font-semibold ${log.response_time_ms > 10000 ? 'text-orange-600' : 'text-gray-500'}`}>
                                {log.response_time_ms > 1000
                                  ? `${(log.response_time_ms / 1000).toFixed(1)}s`
                                  : `${log.response_time_ms}ms`}
                              </span>
                            )}
                            {/* Error flag */}
                            {log.error_message && (
                              <span className="text-xs font-semibold text-red-600">⚠️ Hata</span>
                            )}
                            {/* Timestamp */}
                            <span className="text-xs text-gray-400 ml-auto">
                              {log.timestamp ? new Date(log.timestamp).toLocaleString('tr-TR') : '–'}
                            </span>
                            <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-3 border-t border-gray-200 mt-1">
                              {log.error_message && (
                                <div className="p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800 font-semibold">
                                  Hata: {log.error_message}
                                </div>
                              )}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs font-bold text-gray-700 mb-1">İstek (request_body)</p>
                                  <pre className="text-[11px] bg-gray-100 rounded p-2 whitespace-pre-wrap break-all max-h-56 overflow-y-auto">
                                    {log.request_body
                                      ? typeof log.request_body === 'string'
                                        ? log.request_body
                                        : JSON.stringify(log.request_body, null, 2)
                                      : '(boş)'}
                                  </pre>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-700 mb-1">Yanıt (response_body)</p>
                                  <pre className={`text-[11px] rounded p-2 whitespace-pre-wrap break-all max-h-56 overflow-y-auto ${
                                    isError ? 'bg-red-50' : 'bg-green-50'
                                  }`}>
                                    {log.response_body
                                      ? typeof log.response_body === 'string'
                                        ? log.response_body
                                        : JSON.stringify(log.response_body, null, 2)
                                      : '(boş)'}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StoriesTab() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [selectedStoryForQuestions, setSelectedStoryForQuestions] = useState<number | null>(null);
  const [questions, setQuestions] = useState<ComprehensionQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionFormData, setQuestionFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A' as 'A' | 'B' | 'C' | 'D',
    question_order: 1,
  });
  const [uploadingParagraphs, setUploadingParagraphs] = useState(false);
  const [paragraphUploadMessage, setParagraphUploadMessage] = useState('');

  const fetchStories = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await getStories();
      if (err) throw err;
      setStories(data || []);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Hikayeler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (selectedStoryForQuestions) {
      fetchQuestions();
    }
  }, [selectedStoryForQuestions]);

  const fetchQuestions = async () => {
    if (!selectedStoryForQuestions) return;
    setLoadingQuestions(true);
    try {
      const { data, error: err } = await getComprehensionQuestionsByStory(selectedStoryForQuestions);
      if (err) throw err;
      setQuestions(data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Sorular yüklenemedi');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await updateStory(editingId, {
          title: formData.title,
          description: formData.description,
          image: formData.image,
        });
      } else {
        await createStory(
          parseInt(formData.id),
          formData.title,
          formData.description,
          formData.image
        );
      }

      setFormData({ id: '', title: '', description: '', image: '' });
      setShowForm(false);
      setEditingId(null);
      await fetchStories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'İşlem başarısız oldu';
      setError(message);
    }
  };

  const handleEdit = (story: any) => {
    setFormData({
      id: story.id.toString(),
      title: story.title,
      description: story.description || '',
      image: story.image || '',
    });
    setEditingId(story.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu hikayeyi silmek istediğinize emin misiniz?')) return;

    try {
      await deleteStory(id);
      await fetchStories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Silme işlemi başarısız oldu';
      setError(message);
    }
  };

  const handleUploadParagraphsToSupabase = async () => {
    setUploadingParagraphs(true);
    setParagraphUploadMessage('');
    try {
      let uploaded = 0;
      let failed = 0;
      for (let storyId = 1; storyId <= 24; storyId++) {
        const paragraphs = getParagraphs(storyId);
        if (!paragraphs.length) continue;
        const { error: delErr } = await deleteStoryParagraphs(storyId);
        if (delErr) console.warn(`Story ${storyId} delete paragraphs:`, delErr);
        const payload = paragraphs.map((p, i) => ({
          paragraph_index: i,
          text_segments: p,
        }));
        const { error: insErr } = await insertStoryParagraphs(storyId, payload);
        if (insErr) {
          console.error(`Story ${storyId} insert:`, insErr);
          failed++;
        } else {
          uploaded++;
        }
      }
      setParagraphUploadMessage(
        failed === 0
          ? `Paragraflar yüklendi: ${uploaded} hikaye.`
          : `${uploaded} hikaye yüklendi, ${failed} hikaye hata verdi. Konsolu kontrol edin.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Yükleme başarısız';
      setParagraphUploadMessage(message);
    } finally {
      setUploadingParagraphs(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ id: '', title: '', description: '', image: '' });
            setError('');
          }}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          {showForm ? 'İptal' : '+ Yeni Hikaye Ekle'}
        </button>
        <button
          onClick={handleUploadParagraphsToSupabase}
          disabled={uploadingParagraphs}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg transition-colors"
          title="stories.ts içindeki tüm paragrafları (1–24) story_paragraphs tablosuna yükler"
        >
          {uploadingParagraphs ? 'Yükleniyor...' : 'Paragrafları Supabase\'e yükle (1–24)'}
        </button>
        {paragraphUploadMessage && (
          <span className="text-sm text-gray-700">{paragraphUploadMessage}</span>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-bold text-purple-800">
            {editingId ? 'Hikayeyi Düzenle' : 'Yeni Hikaye Ekle'}
          </h3>
          <p className="text-sm text-gray-600">
            Hikaye kilitleri burada global olarak yönetilmez; kilit durumu her ogrencinin ilerlemesine gore hesaplanir.
          </p>

          {!editingId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hikaye ID
              </label>
              <input
                type="number"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            {editingId ? 'Güncelle' : 'Ekle'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow overflow-hidden">
            {story.image && (
              <img
                src={getStoryImageUrl(story.image)}
                alt={story.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-purple-800 flex-1">{story.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">{story.description}</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(story)}
                    className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                  >
                    Sil
                  </button>
                </div>
                <button
                  onClick={() => setSelectedStoryForQuestions(story.id)}
                  className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded transition-colors"
                >
                  📝 Soruları Yönet
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Questions Management Modal */}
      {selectedStoryForQuestions && (
        <QuestionsModal
          storyId={selectedStoryForQuestions}
          storyTitle={stories.find(s => s.id === selectedStoryForQuestions)?.title || ''}
          questions={questions}
          loadingQuestions={loadingQuestions}
          onClose={() => {
            setSelectedStoryForQuestions(null);
            setShowQuestionForm(false);
            setEditingQuestionId(null);
            setQuestionFormData({
              question_text: '',
              option_a: '',
              option_b: '',
              option_c: '',
              option_d: '',
              correct_option: 'A',
              question_order: 1,
            });
          }}
          onRefresh={fetchQuestions}
        />
      )}
    </div>
  );
}

function QuestionsModal({
  storyId,
  storyTitle,
  questions,
  loadingQuestions,
  onClose,
  onRefresh,
}: {
  storyId: number;
  storyTitle: string;
  questions: ComprehensionQuestion[];
  loadingQuestions: boolean;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionFormData, setQuestionFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A' as 'A' | 'B' | 'C' | 'D',
    question_order: 1,
  });
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [queueBusy, setQueueBusy] = useState(false);

  const handleEnqueueAllQuestions = async () => {
    if (questions.length === 0) return;
    if (
      !confirm(
        `${questions.length} soru için ses üretim işi kuyruğa eklenecek (Storage kullanılmaz). Devam?`
      )
    ) {
      return;
    }
    setQueueBusy(true);
    setError('');
    setInfoMessage(null);
    try {
      for (const q of questions) {
        const { error: jobErr } = await enqueueL5AudioJob(storyId, q.question_order, q.id);
        if (jobErr) throw new Error(jobErr.message);
      }
      setInfoMessage(
        `${questions.length} iş kuyruğa eklendi. GitHub Actions (veya npm run process:l5-audio-jobs) çalışınca MP3’ler repoya yazılır; sonra deploy edin.`
      );
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kuyruk hatası');
    } finally {
      setQueueBusy(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage(null);

    try {
      if (editingQuestionId) {
        await updateComprehensionQuestion(editingQuestionId, questionFormData);
        const { error: jobErr } = await enqueueL5AudioJob(
          storyId,
          questionFormData.question_order,
          editingQuestionId
        );
        if (jobErr) {
          setInfoMessage(`Soru güncellendi; kuyruk hatası: ${jobErr.message}`);
        } else {
          setInfoMessage(
            'Soru güncellendi. Ses üretimi kuyruğa alındı (Supabase Storage kullanılmaz). GitHub Actions işleyip MP3’leri repoya ekler; ardından siteyi yeniden deploy edin.'
          );
        }
      } else {
        const { data, error: createErr } = await createComprehensionQuestion(
          storyId,
          questionFormData.question_text,
          questionFormData.option_a,
          questionFormData.option_b,
          questionFormData.option_c,
          questionFormData.option_d,
          questionFormData.correct_option,
          questionFormData.question_order
        );

        if (createErr) throw createErr;

        if (data?.id) {
          const { error: jobErr } = await enqueueL5AudioJob(
            storyId,
            questionFormData.question_order,
            data.id
          );
          if (jobErr) {
            setInfoMessage(`Soru kaydedildi; kuyruk hatası: ${jobErr.message}`);
          } else {
            setInfoMessage(
              'Soru kaydedildi. Ses üretimi kuyruğa alındı. Birkaç dakika içinde CI işleyecek; deploy sonrası /audios/sorular/ dosyaları canlıda çalışır.'
            );
          }
        }
      }

      setQuestionFormData({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        question_order: questions.length + 1,
      });
      setShowQuestionForm(false);
      setEditingQuestionId(null);
      onRefresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'İşlem başarısız oldu';
      setError(message);
    }
  };

  const handleEditQuestion = (question: ComprehensionQuestion) => {
    setQuestionFormData({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_option: question.correct_option,
      question_order: question.question_order,
    });
    setEditingQuestionId(question.id);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;

    try {
      await deleteComprehensionQuestion(questionId);
      onRefresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Silme işlemi başarısız oldu';
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-800">
            Sorular - {storyTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          {infoMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
              {infoMessage}
            </div>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => {
                setShowQuestionForm(!showQuestionForm);
                setEditingQuestionId(null);
                setInfoMessage(null);
                setQuestionFormData({
                  question_text: '',
                  option_a: '',
                  option_b: '',
                  option_c: '',
                  option_d: '',
                  correct_option: 'A',
                  question_order: questions.length + 1,
                });
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              {showQuestionForm ? 'İptal' : '+ Yeni Soru Ekle'}
            </button>
            {questions.length > 0 && (
              <button
                type="button"
                onClick={handleEnqueueAllQuestions}
                disabled={queueBusy}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
              >
                {queueBusy ? 'Kuyruk ekleniyor...' : 'Tüm soruların sesini kuyruğa al'}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Sesler Supabase Storage’a yazılmaz; kayıt sonrası iş <strong>l5_audio_jobs</strong> kuyruğuna düşer.
            GitHub Actions (veya yerel <code className="bg-gray-100 px-1 rounded">npm run process:l5-audio-jobs</code>) MP3 üretip{' '}
            <code className="bg-gray-100 px-1 rounded">public/audios/sorular/</code> içine commit eder.
          </p>

          {showQuestionForm && (
            <form onSubmit={handleQuestionSubmit} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-purple-800">
                {editingQuestionId ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soru Metni</label>
                <textarea
                  required
                  value={questionFormData.question_text}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, question_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">A) Seçenek</label>
                  <input
                    type="text"
                    required
                    value={questionFormData.option_a}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, option_a: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">B) Seçenek</label>
                  <input
                    type="text"
                    required
                    value={questionFormData.option_b}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, option_b: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">C) Seçenek</label>
                  <input
                    type="text"
                    required
                    value={questionFormData.option_c}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, option_c: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">D) Seçenek</label>
                  <input
                    type="text"
                    required
                    value={questionFormData.option_d}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, option_d: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doğru Cevap</label>
                  <select
                    value={questionFormData.correct_option}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, correct_option: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={questionFormData.question_order}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, question_order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {editingQuestionId ? 'Güncelle ve sesi kuyruğa al' : 'Ekle ve sesi kuyruğa al'}
              </button>

              {infoMessage && (
                <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded mt-2">
                  {infoMessage}
                </div>
              )}
            </form>
          )}

          {loadingQuestions ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Henüz soru eklenmemiş</div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-semibold">
                          Soru {question.question_order}
                        </span>
                        <span className="text-sm text-gray-500">
                          Doğru: {question.correct_option}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800 mb-3">{question.question_text}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className={question.correct_option === 'A' ? 'text-green-600 font-semibold' : ''}>
                          A) {question.option_a}
                        </div>
                        <div className={question.correct_option === 'B' ? 'text-green-600 font-semibold' : ''}>
                          B) {question.option_b}
                        </div>
                        <div className={question.correct_option === 'C' ? 'text-green-600 font-semibold' : ''}>
                          C) {question.option_c}
                        </div>
                        <div className={question.correct_option === 'D' ? 'text-green-600 font-semibold' : ''}>
                          D) {question.option_d}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                      >
                        Sil
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Seslendirmeler:</div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <span>
                        {question.l5_audio_urls?.question || question.question_audio_url ? '✓ Soru' : '– Soru'}
                      </span>
                      <span>
                        {question.l5_audio_urls?.A ? '✓ Şık A' : '– Şık A'}
                      </span>
                      <span>
                        {question.l5_audio_urls?.B ? '✓ Şık B' : '– Şık B'}
                      </span>
                      <span>
                        {question.l5_audio_urls?.C ? '✓ Şık C' : '– Şık C'}
                      </span>
                      <span>
                        {question.l5_audio_urls?.D ? '✓ Şık D' : '– Şık D'}
                      </span>
                      <span>
                        {question.l5_audio_urls?.correct || question.correct_answer_audio_url
                          ? '✓ Doğru cevap'
                          : '– Doğru cevap'}
                      </span>
                      <span>
                        {question.l5_audio_urls?.wrong || question.wrong_answer_audio_url
                          ? '✓ Yanlış cevap'
                          : '– Yanlış cevap'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState({
    recording_duration_ms: 10000,
    voice_response_timeout_ms: 60000,
    paragraph_response_timeout_ms: 60000,
    level2_step1_reading_seconds: 360,
    level3_step2_reading_seconds: 360,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // API Environment and App Mode state
  const [apiEnv, setApiEnvState] = useState<ApiEnv>(getApiEnv());
  const [appMode, setAppModeState] = useState<AppMode>(getAppMode());
  const [skipIntro, setSkipIntroState] = useState<boolean>(localStorage.getItem('dost_skip_intro') === 'true');

  useEffect(() => {
    fetchSettings();
  }, []);
  
  const handleApiEnvChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEnv = e.target.value as ApiEnv;
    setApiEnvState(newEnv);
    setApiEnv(newEnv);
    setMessage({ type: 'success', text: `API ortamı "${newEnv}" olarak değiştirildi. Sayfayı yenileyebilirsiniz.` });
  };
  
  const handleAppModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as AppMode;
    setAppModeState(newMode);
    setAppMode(newMode);
    setMessage({ type: 'success', text: `Çalışma modu "${newMode}" olarak değiştirildi.` });
  };
  
  const handleSkipIntroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setSkipIntroState(newValue);
    if (newValue) {
      localStorage.setItem('dost_skip_intro', 'true');
    } else {
      localStorage.removeItem('dost_skip_intro');
    }
    setMessage({ type: 'success', text: `Intro video geçme ${newValue ? 'aktif' : 'pasif'} edildi.` });
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Try to get from Supabase app_settings table
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'recording_duration_ms')
        .single();

      if (!error && data) {
        setSettings(prev => ({
          ...prev,
          recording_duration_ms: parseInt(data.value) || 10000,
        }));
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('voice_recording_duration_ms');
        if (stored) {
          setSettings(prev => ({
            ...prev,
            recording_duration_ms: parseInt(stored) || 10000,
          }));
        }
      }

      // Try to get voice_response_timeout_ms
      const { data: timeoutData, error: timeoutError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'voice_response_timeout_ms')
        .single();

      if (!timeoutError && timeoutData) {
        setSettings(prev => ({
          ...prev,
          voice_response_timeout_ms: parseInt(timeoutData.value) || 60000,
        }));
      }

      // Try to get paragraph_response_timeout_ms
      const { data: paragraphTimeoutData, error: paragraphTimeoutError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'paragraph_response_timeout_ms')
        .single();

      if (!paragraphTimeoutError && paragraphTimeoutData) {
        setSettings(prev => ({
          ...prev,
          paragraph_response_timeout_ms: parseInt(paragraphTimeoutData.value) || 60000,
        }));
      }

      const { data: l2Data, error: l2Error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'level2_step1_reading_seconds')
        .single();
      if (!l2Error && l2Data) {
        setSettings(prev => ({
          ...prev,
          level2_step1_reading_seconds: parseInt(l2Data.value) || 360,
        }));
      }
      const { data: l3Data, error: l3Error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'level3_step2_reading_seconds')
        .single();
      if (!l3Error && l3Data) {
        setSettings(prev => ({
          ...prev,
          level3_step2_reading_seconds: parseInt(l3Data.value) || 360,
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      // Fallback to defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Save to Supabase app_settings table
      const { error: recordingError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'recording_duration_ms',
          value: String(settings.recording_duration_ms),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'key',
        });

      if (recordingError) throw recordingError;

      const { error: timeoutError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'voice_response_timeout_ms',
          value: String(settings.voice_response_timeout_ms),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'key',
        });

      if (timeoutError) throw timeoutError;

      const { error: paragraphTimeoutError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'paragraph_response_timeout_ms',
          value: String(settings.paragraph_response_timeout_ms),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'key',
        });

      if (paragraphTimeoutError) throw paragraphTimeoutError;

      const { error: l2SaveError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'level2_step1_reading_seconds',
          value: String(settings.level2_step1_reading_seconds),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });
      if (l2SaveError) throw l2SaveError;

      const { error: l3SaveError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'level3_step2_reading_seconds',
          value: String(settings.level3_step2_reading_seconds),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });
      if (l3SaveError) throw l3SaveError;

      // Also update localStorage for backward compatibility
      localStorage.setItem('voice_recording_duration_ms', String(settings.recording_duration_ms));
      localStorage.setItem('voice_response_timeout_ms', String(settings.voice_response_timeout_ms));
      localStorage.setItem('paragraph_response_timeout_ms', String(settings.paragraph_response_timeout_ms));
      localStorage.setItem('level2_step1_reading_seconds', String(settings.level2_step1_reading_seconds));
      localStorage.setItem('level3_step2_reading_seconds', String(settings.level3_step2_reading_seconds));

      setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: 'Ayarlar kaydedilirken hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Ayarlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Uygulama Ayarları</h2>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* API Environment */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">🔧 Geliştirici Ayarları</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Ortamı
              </label>
              <select
                value={apiEnv}
                onChange={handleApiEnvChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="test">Test (webhook-test)</option>
                <option value="product">Production (webhook)</option>
              </select>
              <p className="mt-2 text-xs text-gray-600">
                Aktif: <span className="font-mono text-purple-700">{getApiBase()}</span>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çalışma Modu
              </label>
              <select
                value={appMode}
                onChange={handleAppModeChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="dev">Dev (Hızlı Test)</option>
                <option value="prod">Prod (Normal)</option>
              </select>
              <p className="mt-2 text-xs text-gray-600">
                {appMode === 'dev' ? '🔧 Sesleri atlayabilir, hızlı geçiş' : '📚 Normal akış'}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={skipIntro}
                onChange={handleSkipIntroChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Intro Video'yu Geç
              </span>
            </label>
            <p className="mt-2 text-xs text-gray-600 ml-6">
              {skipIntro ? '✅ Intro video otomatik olarak geçilecek' : '❌ Intro video gösterilecek'}
            </p>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Recording Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ses Kaydı Süresi (milisaniye)
          </label>
          <input
            type="number"
            min="3000"
            max="120000"
            step="1000"
            value={settings.recording_duration_ms}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              recording_duration_ms: parseInt(e.target.value) || 10000,
            }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <p className="mt-2 text-xs text-gray-600">
            Mikrofon kaydı {settings.recording_duration_ms / 1000} saniye sonra otomatik olarak gönderilir.
            (Min: 3 saniye, Max: 120 saniye)
          </p>
        </div>

        {/* Voice Response Timeout */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ses Cevap Verme Timeout Süresi (milisaniye)
          </label>
          <input
            type="number"
            min="10000"
            max="300000"
            step="5000"
            value={settings.voice_response_timeout_ms}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              voice_response_timeout_ms: parseInt(e.target.value) || 60000,
            }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <p className="mt-2 text-xs text-gray-600">
            API'ye gönderilen ses kayıtları için {settings.voice_response_timeout_ms / 1000} saniye timeout süresi kullanılacak.
            (Min: 10 saniye, Max: 300 saniye)
          </p>
        </div>

        {/* Paragraph Response Timeout */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paragraf Cevap Verme Timeout Süresi (milisaniye) - Level 3
          </label>
          <input
            type="number"
            min="10000"
            max="300000"
            step="5000"
            value={settings.paragraph_response_timeout_ms}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              paragraph_response_timeout_ms: parseInt(e.target.value) || 60000,
            }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <p className="mt-2 text-xs text-gray-600">
            Level 3 paragraf okuma kısmında API'ye gönderilen ses kayıtları için {settings.paragraph_response_timeout_ms / 1000} saniye timeout süresi kullanılacak.
            (Min: 10 saniye, Max: 300 saniye)
          </p>
        </div>

        {/* Level 2 Step 1 - Metni okuma süresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seviye 2 Adım 1 – Metni okuma süresi (saniye)
          </label>
          <input
            type="number"
            min="120"
            max="600"
            step="30"
            value={settings.level2_step1_reading_seconds}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              level2_step1_reading_seconds: parseInt(e.target.value) || 360,
            }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <p className="mt-2 text-xs text-gray-600">
            Metni okuma aşamasında verilen süre: {settings.level2_step1_reading_seconds} saniye ({Math.floor(settings.level2_step1_reading_seconds / 60)} dk). Varsayılan: 360 (6 dk).
          </p>
        </div>

        {/* Level 3 Step 2 - Metni okuma süresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seviye 3 Adım 2 – Metni okuma süresi (saniye)
          </label>
          <input
            type="number"
            min="120"
            max="600"
            step="30"
            value={settings.level3_step2_reading_seconds}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              level3_step2_reading_seconds: parseInt(e.target.value) || 360,
            }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <p className="mt-2 text-xs text-gray-600">
            Üçüncü okuma aşamasında verilen süre: {settings.level3_step2_reading_seconds} saniye ({Math.floor(settings.level3_step2_reading_seconds / 60)} dk). Varsayılan: 360 (6 dk).
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
