import { useState, type FormEvent } from 'react';
import { X, Lock, User, Sparkles, Heart, Phone, Mail, GraduationCap, CheckCircle } from 'lucide-react';
import type { Classroom, Student } from '../types';
import { AVATAR_OPTIONS } from '../data/mockData';
import { sound } from '../lib/audioEffects';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'teacher' | 'student-register' | 'student-login';
  classes: Classroom[];
  existingStudents: Student[];
  onClose: () => void;
  onTeacherLogin: (username: string) => void;
  onStudentLogin: (student: Student) => void;
  onStudentRegister: (newStudent: Omit<Student, 'id' | 'registeredAt' | 'starsCount'>) => void;
}

export function AuthModal({
  isOpen,
  initialTab = 'student-register',
  classes,
  existingStudents,
  onClose,
  onTeacherLogin,
  onStudentLogin,
  onStudentRegister
}: AuthModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'teacher' | 'student-register' | 'student-login'>(initialTab);
  
  // Teacher credentials
  const [teacherUser, setTeacherUser] = useState('sıla');
  const [teacherPass, setTeacherPass] = useState('1234');
  const [teacherError, setTeacherError] = useState('');

  // Student register state
  const [name, setName] = useState('');
  const [age, setAge] = useState(4);
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-1');
  const [selectedAvatar, setSelectedAvatar] = useState('🐰');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Student login
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPass, setStudentPass] = useState('');
  const [studentLoginError, setStudentLoginError] = useState('');

  const handleTeacherSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTeacherError('');
    const cleanUser = teacherUser.trim().toLowerCase();
    
    // Check credentials: username "sıla" or "sila" and password "1234"
    if ((cleanUser === 'sıla' || cleanUser === 'sila') && teacherPass.trim() === '1234') {
      sound.playSuccess();
      onTeacherLogin('Sıla Öğretmen');
      onClose();
    } else {
      sound.playBoing();
      setTeacherError('Kullanıcı adı veya şifre hatalı! (Kullanıcı: sıla, Şifre: 1234)');
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !parentName || !email) {
      sound.playBoing();
      return;
    }

    const targetClass = classes.find((c) => c.id === selectedClassId) || classes[0];

    onStudentRegister({
      name,
      age,
      parentName,
      parentPhone: parentPhone || '0555 123 45 67',
      email,
      password: password || '123',
      classId: targetClass.id,
      className: targetClass.name,
      avatar: selectedAvatar,
      teacherNote: 'Yeni kayıt olan sevimli öğrencimiz. Hoş geldin!'
    });

    sound.playStarChime();
    setRegisterSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleStudentLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStudentLoginError('');

    const found = existingStudents.find(
      (s) => s.email.toLowerCase() === studentEmail.toLowerCase() || s.name.toLowerCase() === studentEmail.toLowerCase()
    );

    if (found) {
      sound.playSuccess();
      onStudentLogin(found);
      onClose();
    } else {
      sound.playBoing();
      setStudentLoginError('Bu e-posta veya isimle kayıtlı öğrenci bulunamadı.');
    }
  };

  const handleQuickStudentSelect = (std: Student) => {
    sound.playSuccess();
    onStudentLogin(std);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fdfcfb] rounded-3xl shadow-xl border border-[#e1eef5] max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Tabs */}
        <div className="bg-[#f8fcfd] p-4 border-b border-[#e1eef5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <h3 className="font-bold text-[#4e6a8e] text-lg">
              Minik Adımlar Giriş & Kayıt
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-600 border border-[#e1eef5] flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 p-2 bg-white border-b border-[#e1eef5] gap-1.5 text-xs sm:text-sm font-bold">
          <button
            id="tab-teacher-login"
            onClick={() => {
              setActiveTab('teacher');
              sound.playPop();
            }}
            className={`py-2.5 px-2 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 border ${
              activeTab === 'teacher'
                ? 'bg-[#f8c8dc] text-gray-800 border-[#e5a8c2] shadow-xs'
                : 'text-gray-600 border-transparent hover:bg-[#f8c8dc]/20'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="truncate">Yönetici / Sıla</span>
          </button>

          <button
            id="tab-student-register"
            onClick={() => {
              setActiveTab('student-register');
              sound.playPop();
            }}
            className={`py-2.5 px-2 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 border ${
              activeTab === 'student-register'
                ? 'bg-[#a7c7e7] text-[#395679] border-[#8fb5da] shadow-xs'
                : 'text-gray-600 border-transparent hover:bg-[#a7c7e7]/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate">Öğrenci Kaydı</span>
          </button>

          <button
            id="tab-student-login"
            onClick={() => {
              setActiveTab('student-login');
              sound.playPop();
            }}
            className={`py-2.5 px-2 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 border ${
              activeTab === 'student-login'
                ? 'bg-amber-200 text-amber-900 border-amber-300 shadow-xs'
                : 'text-gray-600 border-transparent hover:bg-amber-50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate">Öğrenci Girişi</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#fdfcfb]">
          {/* TAB 1: TEACHER LOGIN */}
          {activeTab === 'teacher' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#fcf2f6] border border-[#f3d5dc] text-[#96476c] mx-auto flex items-center justify-center text-3xl mb-2">
                  👩‍🏫
                </div>
                <h4 className="font-bold text-gray-800 text-lg">Öğretmen / Yönetici Girişi</h4>
                <p className="text-xs text-gray-500">
                  Öğrenci takibi, not girişi, sınıf yönetimi ve video yükleme paneli
                </p>
              </div>

              {teacherError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {teacherError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <input
                    id="teacher-username-input"
                    type="text"
                    value={teacherUser}
                    onChange={(e) => setTeacherUser(e.target.value)}
                    required
                    placeholder="sıla"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium text-gray-800 bg-white"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#4e6a8e] font-semibold bg-[#eef6fc] px-2 py-0.5 rounded-lg">
                    Örn: sıla
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    id="teacher-password-input"
                    type="password"
                    value={teacherPass}
                    onChange={(e) => setTeacherPass(e.target.value)}
                    required
                    placeholder="1234"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium text-gray-800 bg-white"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#4e6a8e] font-semibold bg-[#eef6fc] px-2 py-0.5 rounded-lg">
                    Örn: 1234
                  </span>
                </div>
              </div>

              <button
                id="btn-teacher-login"
                type="submit"
                className="w-full py-3 bg-[#f8c8dc] hover:bg-[#e5a8c2] text-gray-800 font-bold rounded-2xl border border-[#e5a8c2] shadow-xs active:scale-95 transition cursor-pointer mt-2"
              >
                Sıla Öğretmen Olarak Giriş Yap
              </button>

              <div className="pt-3 border-t border-[#e1eef5] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setTeacherUser('sıla');
                    setTeacherPass('1234');
                  }}
                  className="text-xs text-[#4e6a8e] hover:underline font-semibold"
                >
                  ⚡ Bilgileri Otomatik Doldur (sıla / 1234)
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: STUDENT / PARENT REGISTRATION */}
          {activeTab === 'student-register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="text-center mb-3">
                <h4 className="font-bold text-gray-800 text-lg">Öğrenci & Veli Kayıt Formu</h4>
                <p className="text-xs text-gray-500">
                  Aramıza katıl, ders videolarını izle, oyunlar oyna ve yıldızlar kazan!
                </p>
              </div>

              {registerSuccess ? (
                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                  <h5 className="font-bold text-emerald-800 text-base">Kayıt Başarıyla Tamamlandı! 🎉</h5>
                  <p className="text-xs text-emerald-700">Minik öğrencimiz sisteme kaydedildi ve giriş yapılıyor...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Öğrencinin Adı Soyadı *
                      </label>
                      <input
                        id="reg-student-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Örn: Elif Yıldız"
                        className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Öğrencinin Yaşı
                      </label>
                      <select
                        id="reg-student-age"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium bg-white"
                      >
                        <option value={3}>3 Yaş</option>
                        <option value={4}>4 Yaş</option>
                        <option value={5}>5 Yaş</option>
                        <option value={6}>6 Yaş (Okul Öncesi)</option>
                      </select>
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Öğrenci Maskot Avatarı Seçin
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 bg-[#eef6fc] rounded-2xl border border-[#8fb5da]/40">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av.emoji}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(av.emoji);
                            sound.playPop();
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition cursor-pointer ${
                            selectedAvatar === av.emoji
                              ? 'bg-[#a7c7e7] text-gray-900 scale-110 shadow-xs border border-[#8fb5da]'
                              : 'bg-white hover:bg-white/80'
                          }`}
                          title={av.label}
                        >
                          {av.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500" /> Anne / Baba (Veli) Adı *
                      </label>
                      <input
                        id="reg-parent-name"
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                        placeholder="Örn: Merve Yıldız"
                        className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#395679]" /> Veli Telefon Numarası
                      </label>
                      <input
                        id="reg-parent-phone"
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="0532 000 00 00"
                        className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-amber-600" /> E-posta Adresi *
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="elif@anaokulu.com"
                        className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-gray-500" /> Şifre
                      </label>
                      <input
                        id="reg-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="123"
                        className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#96476c]" /> Kayıt Olunacak Sınıf
                    </label>
                    <select
                      id="reg-class-select"
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#8fb5da] focus:outline-none text-sm font-medium bg-white"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.ageGroup})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    id="btn-register-submit"
                    type="submit"
                    className="w-full py-3 bg-[#a7c7e7] hover:bg-[#8fb5da] text-[#395679] font-bold rounded-2xl border border-[#8fb5da] shadow-xs active:scale-95 transition cursor-pointer mt-2"
                  >
                    Öğrenciyi Kaydet & Portala Başla 🚀
                  </button>
                </>
              )}
            </form>
          )}

          {/* TAB 3: STUDENT LOGIN */}
          {activeTab === 'student-login' && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center text-3xl mb-2">
                  🎈
                </div>
                <h4 className="font-bold text-gray-800 text-lg">Öğrenci Girişi</h4>
                <p className="text-xs text-gray-500">
                  Kayıtlı öğrencinizi seçin veya bilgileri girerek giriş yapın
                </p>
              </div>

              {studentLoginError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {studentLoginError}
                </div>
              )}

              {/* Quick Select for registered students */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Hızlı Öğrenci Seçimi (Kayıtlı Öğrenciler):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {existingStudents.map((std) => (
                    <button
                      key={std.id}
                      type="button"
                      onClick={() => handleQuickStudentSelect(std)}
                      className="p-2.5 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-300 flex items-center gap-2.5 transition text-left cursor-pointer"
                    >
                      <span className="text-2xl">{std.avatar || '🐰'}</span>
                      <div className="overflow-hidden">
                        <span className="block text-xs font-bold text-gray-800 truncate">
                          {std.name}
                        </span>
                        <span className="block text-[10px] text-amber-700 font-semibold truncate">
                          {std.className?.split(' ')[1] || 'Sınıfı'} • {std.starsCount} ⭐
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#e1eef5]"></div>
                <span className="flex-shrink mx-3 text-gray-400 text-xs font-medium">veya e-posta ile</span>
                <div className="flex-grow border-t border-[#e1eef5]"></div>
              </div>

              <form onSubmit={handleStudentLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Öğrenci E-postası veya Adı
                  </label>
                  <input
                    type="text"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="ayse@anaokulu.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-amber-200 focus:border-amber-400 focus:outline-none text-sm font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Şifre
                  </label>
                  <input
                    type="password"
                    value={studentPass}
                    onChange={(e) => setStudentPass(e.target.value)}
                    placeholder="123"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-amber-200 focus:border-amber-400 focus:outline-none text-sm font-medium bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-2xl border border-amber-300 shadow-xs active:scale-95 transition cursor-pointer"
                >
                  Giriş Yap ve Derslere Başla
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
