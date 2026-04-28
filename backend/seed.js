/**
 * DATABASE SEEDING SCRIPT
 * This script populates the database with sample data for testing
 * 
 * Run: node seed.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Student = require("./models/Student");
const Seat = require("./models/Seat");
const Fee = require("./models/Fee");

const connectDB = require("./config/db");

async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Student.deleteMany({});
    await Seat.deleteMany({});
    await Fee.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create Admin User
    console.log("👤 Creating admin user...");
    const adminUser = await User.create({
      username: "admin",
      password: "admin123",
      email: "admin@library.com",
      role: "admin",
      isActive: true,
    });
    console.log("✅ Admin created: admin / admin123");

    // Create Student Users
    console.log("🧑‍🎓 Creating student users...");
    const studentUser1 = await User.create({
      username: "9876543210",
      password: "9876543210",
      email: "amit@student.com",
      role: "student",
      isActive: true,
    });

    const studentUser2 = await User.create({
      username: "9123456780",
      password: "9123456780",
      email: "priya@student.com",
      role: "student",
      isActive: true,
    });

    const studentUser3 = await User.create({
      username: "9988776655",
      password: "9988776655",
      email: "rahul@student.com",
      role: "student",
      isActive: true,
    });
    console.log("✅ Students created");

    // Create Students
    console.log("📚 Creating students...");
    const student1 = await Student.create({
      userId: studentUser1._id,
      name: "Amit Sharma",
      phone: "9876543210",
      aadhaar: "1234-5678-9012",
      address: "Delhi, India",
      joiningDate: new Date("2024-01-10"),
      feeStatus: "Paid",
      totalFeesDue: 0,
      isActive: true,
    });

    const student2 = await Student.create({
      userId: studentUser2._id,
      name: "Priya Singh",
      phone: "9123456780",
      aadhaar: "2345-6789-0123",
      address: "Mumbai, India",
      joiningDate: new Date("2024-02-15"),
      feeStatus: "Due",
      totalFeesDue: 1200,
      isActive: true,
    });

    const student3 = await Student.create({
      userId: studentUser3._id,
      name: "Rahul Verma",
      phone: "9988776655",
      aadhaar: "3456-7890-1234",
      address: "Lucknow, India",
      joiningDate: new Date("2024-03-01"),
      feeStatus: "Paid",
      totalFeesDue: 0,
      isActive: true,
    });

    const studentUser4 = await User.create({
      username: "9999888877",
      password: "9999888877",
      email: "neha@student.com",
      role: "student",
      isActive: true,
    });

    const studentUser5 = await User.create({
      username: "8765432109",
      password: "8765432109",
      email: "vikram@student.com",
      role: "student",
      isActive: true,
    });

    const student4 = await Student.create({
      userId: studentUser4._id,
      name: "Neha Patel",
      phone: "9999888877",
      aadhaar: "4567-8901-2345",
      address: "Bangalore, India",
      joiningDate: new Date("2024-04-05"),
      feeStatus: "Due",
      totalFeesDue: 2400,
      isActive: true,
    });

    const student5 = await Student.create({
      userId: studentUser5._id,
      name: "Vikram Singh",
      phone: "8765432109",
      aadhaar: "5678-9012-3456",
      address: "Pune, India",
      joiningDate: new Date("2024-04-10"),
      feeStatus: "Paid",
      totalFeesDue: 0,
      isActive: true,
    });

    console.log("✅ Students created");

    // Create Seats
    console.log("🪑 Creating seats...");
    const seats = [];
    for (let i = 1; i <= 10; i++) {
      const seat = await Seat.create({
        seatNumber: i,
        status: i <= 3 ? "Occupied" : "Available",
        assignedStudent:
          i === 1
            ? student3._id
            : i === 2
              ? student1._id
              : i === 3
                ? student2._id
                : null,
        assignedDate:
          i <= 3
            ? new Date(
                "2024-" +
                  (i === 1 ? "03" : i === 2 ? "01" : "02") +
                  "-01"
              )
            : null,
        monthlyRate: 1200,
        notes: i <= 3 ? `Occupied by student ${i}` : "",
      });
      seats.push(seat);

      // Update student's currentSeat
      if (i === 1) student3.currentSeat = seat._id;
      if (i === 2) student1.currentSeat = seat._id;
      if (i === 3) student2.currentSeat = seat._id;
    }

    // Save updated students
    await student1.save();
    await student2.save();
    await student3.save();

    console.log("✅ Seats created");

    // Create Fees
    console.log("💰 Creating fee records...");
    const fees = [
      {
        student: student1._id,
        amount: 1200,
        month: "2024-01",
        paymentDate: new Date("2024-01-05"),
        status: "Paid",
        paymentMethod: "Online",
      },
      {
        student: student1._id,
        amount: 1200,
        month: "2024-02",
        paymentDate: new Date("2024-02-05"),
        status: "Paid",
        paymentMethod: "Cash",
      },
      {
        student: student1._id,
        amount: 1200,
        month: "2024-03",
        paymentDate: new Date("2024-03-05"),
        status: "Paid",
        paymentMethod: "Online",
      },
      {
        student: student1._id,
        amount: 1200,
        month: "2024-04",
        paymentDate: new Date("2024-04-05"),
        status: "Paid",
        paymentMethod: "Cash",
      },
      {
        student: student2._id,
        amount: 1200,
        month: "2024-02",
        paymentDate: new Date("2024-02-20"),
        status: "Paid",
        paymentMethod: "Online",
      },
      {
        student: student2._id,
        amount: 1200,
        month: "2024-03",
        status: "Due",
        paymentMethod: "Cash",
      },
      {
        student: student2._id,
        amount: 1200,
        month: "2024-04",
        status: "Due",
        paymentMethod: "Cash",
      },
      {
        student: student3._id,
        amount: 1200,
        month: "2024-03",
        paymentDate: new Date("2024-03-10"),
        status: "Paid",
        paymentMethod: "Cash",
      },
      {
        student: student3._id,
        amount: 1200,
        month: "2024-04",
        paymentDate: new Date("2024-04-10"),
        status: "Paid",
        paymentMethod: "Online",
      },
      {
        student: student4._id,
        amount: 1200,
        month: "2024-04",
        status: "Due",
        paymentMethod: "Cash",
      },
      {
        student: student5._id,
        amount: 1200,
        month: "2024-04",
        paymentDate: new Date("2024-04-12"),
        status: "Paid",
        paymentMethod: "Online",
      },
    ];

    await Fee.insertMany(fees);
    console.log("✅ Fee records created");

    console.log("\n");
    console.log("═══════════════════════════════════════════════════");
    console.log("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════════════");
    console.log("\n📊 Data Summary:");
    console.log(`   • Admin Users: 1`);
    console.log(`   • Students: 5`);
    console.log(`   • Seats: 10 (3 occupied, 7 available)`);
    console.log(`   • Fee Records: 11`);
    console.log("\n🔐 Login Credentials:");
    console.log(`   Admin:`);
    console.log(`     - Username: admin`);
    console.log(`     - Password: admin123`);
    console.log(`\n   Students:`);
    console.log(`     - Phone/Aadhaar: 9876543210 | Password: 9876543210 (Amit Sharma)`);
    console.log(`     - Phone/Aadhaar: 9123456780 | Password: 9123456780 (Priya Singh)`);
    console.log(`     - Phone/Aadhaar: 9988776655 | Password: 9988776655 (Rahul Verma)`);
    console.log("\n✨ You can now test the application with real data!");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
}

seed();
