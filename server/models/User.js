const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dealer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
role: {
  type: String,
  enum: ['admin', 'dealer'],
  default: 'dealer',
},
    // Invoice Header - Business Information
    companyName: {
      type: String,
      default: 'Smart-Tech Service Limited',
      trim: true,
    },
    dutyParagraph: {
      type: String,
      default: '',
      trim: true,
    },
    businessRegNo: {
      type: String,
      default: '',
      trim: true,
    },
    bankAccount: {
      type: String,
      default: '',
      trim: true,
    },

    // Service Center Details
    serviceCenter: {
      name: { type: String, default: 'Smart Tech Center', trim: true },
      address: { type: String, default: 'Gulshan Tread Building, T.', trim: true },
      contact: { type: String, default: '+880-1893722002', trim: true },
      sealName: { type: String, default: '', trim: true }, // Footer seal text
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt Password
userSchema.pre('save', async function () {
  // If password is not modified, simply return
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match Password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);