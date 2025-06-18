// hooks/useRegisterForm.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { jwtDecode } from 'jwt-decode';

// --- Interfaces ---
interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
}

interface DecodedGoogleToken {
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub: string;
}

// --- Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1/auth';

export const useRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasDigit: false,
    hasSpecialChar: false,
  });

  // --- THE CRITICAL FIX: Initialize useRouter ---
  const router = useRouter(); // <--- ADD THIS LINE

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
    setPasswordStrength({
      minLength: formData.password.length >= 8,
      hasUpperCase: /[A-Z]/.test(formData.password),
      hasLowerCase: /[a-z]/.test(formData.password),
      hasDigit: /\d/.test(formData.password),
      hasSpecialChar: /[!@#$%^&*()_+={}[\]:;"'<>,.?/~`\-|\\]/.test(formData.password), // Improved regex
    });
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualRegister = async () => {
    setMessage('');
    setIsError(false);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('Harap lengkapi semua bidang.');
      setIsError(true);
      return;
    }

    if (!passwordMatch) {
      setMessage('Password dan konfirmasi password tidak cocok.');
      setIsError(true);
      return;
    }

    if (!Object.values(passwordStrength).every(Boolean)) {
      setMessage('Password tidak memenuhi kriteria keamanan.');
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword, // Keep if backend expects it
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Terjadi kesalahan saat registrasi.');
        setIsError(true);
      } else {
        setMessage('Registrasi berhasil! Selamat datang di komunitas kami ✨');
        setIsError(false);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });

        setTimeout(() => {
          router.push('/auth/login'); // Use router.push
        }, 2000);
      }
    } catch (error) {
      console.error('Error during manual registration:', error);
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const decoded: DecodedGoogleToken = jwtDecode(response.credential);
      console.log('Google Login Success (decoded in hook):', decoded);

      const backendResponse = await fetch(`${API_BASE_URL}/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await backendResponse.json();

      if (!backendResponse.ok) {
        setMessage(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Terjadi kesalahan saat login dengan Google.');
        setIsError(true);
      } else {
        setMessage('Login dengan Google berhasil! Selamat datang ✨');
        setIsError(false);
        // You might want to save auth data here, e.g., using a storage utility
        // if (data.access_token && data.user) {
        //   const { storage } = await import('@/lib/utils/storage');
        //   storage.setAuthData(data.access_token, data.user);
        // }

        setTimeout(() => {
          router.push('/dashboard'); // Use router.push
        }, 1500);
      }
    } catch (error) {
      console.error('Error during Google login processing:', error);
      setMessage('Terjadi kesalahan saat memproses login Google.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google Login Failed.');
    setMessage('Login dengan Google gagal. Silakan coba lagi.');
    setIsError(true);
    setLoading(false);
  };

  return {
    formData,
    handleChange,
    handleManualRegister,
    handleGoogleSuccess,
    handleGoogleFailure,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    message,
    isError,
    passwordMatch,
    passwordStrength,
  };
};