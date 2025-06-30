// src/common/validators/match-password.validator.ts
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

// Import DTO yang akan menggunakan validator ini, dalam kasus ini RegisterDto.
// Ini penting untuk memberikan tipe yang akurat pada `args.object`.
import { RegisterDto } from '../../auth/dto/register.dto';

@ValidatorConstraint({ name: 'matchPassword', async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  /**
   * Metode `validate` akan dipanggil oleh class-validator.
   *
   * @param value Nilai properti yang sedang divalidasi (dalam kasus ini, `confirmPassword`).
   * @param args Objek ValidationArguments yang berisi metadata tentang validasi.
   * `args.object` adalah objek lengkap yang sedang divalidasi (mis. instance RegisterDto).
   */
  validate(value: any, args: ValidationArguments) {
    // Pastikan `value` adalah string untuk perbandingan yang valid
    if (typeof value !== 'string') {
        return false;
    }

    const [relatedPropertyName] = args.constraints; // Mengambil nama properti yang akan dibandingkan (misalnya 'password')

    // Mengakses objek yang sedang divalidasi (mis. RegisterDto)
    // dan mengambil nilai properti yang terkait (mis. RegisterDto.password)
    const relatedValue = (args.object as RegisterDto)[relatedPropertyName]; // <-- Perbaikan: Cast ke RegisterDto

    // Melakukan perbandingan antara nilai properti saat ini (confirmPassword)
    // dengan nilai properti yang terkait (password)
    return value === relatedValue;
  }

  /**
   * Metode `defaultMessage` menyediakan pesan error default jika validasi gagal.
   */
  defaultMessage(args: ValidationArguments) {
    return 'Password dan konfirmasi password tidak cocok.';
  }
}