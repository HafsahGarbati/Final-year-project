const sequelize = require('../config/database');
const { User, Wallet, Transaction, Merchant } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Seed Database with Demo Data
 * Run with: node src/utils/seedDatabase.js
 */
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...');

        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Sync models (force: true will drop existing tables)
        await sequelize.sync({ force: true });
        console.log('✅ Database synced');

        // Hash PIN
        const hashedPin = await bcrypt.hash('1234', 10);

        // Create Students
        const students = await User.bulkCreate([
            {
                studentId: 'STU001',
                name: 'John Doe',
                email: 'john.doe@campus.edu',
                phone: '08012345678',
                pin: hashedPin,
                role: 'student',
                status: 'active',
                dailyLimit: 50000
            },
            {
                studentId: 'STU002',
                name: 'Sarah Johnson',
                email: 'sarah.j@campus.edu',
                phone: '08023456789',
                pin: hashedPin,
                role: 'student',
                status: 'active',
                dailyLimit: 50000
            },
            {
                studentId: 'STU003',
                name: 'Michael Chen',
                email: 'michael.c@campus.edu',
                phone: '08034567890',
                pin: hashedPin,
                role: 'student',
                status: 'active',
                dailyLimit: 50000
            },
            {
                studentId: 'STU004',
                name: 'Emily Brown',
                email: 'emily.b@campus.edu',
                phone: '08045678901',
                pin: hashedPin,
                role: 'student',
                status: 'active',
                dailyLimit: 50000
            },
            {
                studentId: 'STU005',
                name: 'David Wilson',
                email: 'david.w@campus.edu',
                phone: '08056789012',
                pin: hashedPin,
                role: 'student',
                status: 'suspended',
                dailyLimit: 50000
            }
        ]);
        console.log(`✅ Created ${students.length} students`);

        // Create student wallets
        await Promise.all([
            Wallet.create({ userId: students[0].id, balance: 25000 }),
            Wallet.create({ userId: students[1].id, balance: 15500 }),
            Wallet.create({ userId: students[2].id, balance: 8750 }),
            Wallet.create({ userId: students[3].id, balance: 42000 }),
            Wallet.create({ userId: students[4].id, balance: 3200 })
        ]);
        console.log('✅ Created student wallets');

        // Create Merchants
        const merchants = await User.bulkCreate([
            {
                studentId: 'MER001',
                name: 'Campus Cafeteria',
                email: 'cafeteria@campus.edu',
                phone: '08067890123',
                pin: hashedPin,
                role: 'merchant',
                status: 'active'
            },
            {
                studentId: 'MER002',
                name: 'Campus Bookstore',
                email: 'bookstore@campus.edu',
                phone: '08078901234',
                pin: hashedPin,
                role: 'merchant',
                status: 'active'
            },
            {
                studentId: 'MER003',
                name: 'Print & Copy Center',
                email: 'printcenter@campus.edu',
                phone: '08089012345',
                pin: hashedPin,
                role: 'merchant',
                status: 'active'
            },
            {
                studentId: 'MER004',
                name: 'Campus Pharmacy',
                email: 'pharmacy@campus.edu',
                phone: '08090123456',
                pin: hashedPin,
                role: 'merchant',
                status: 'active'
            }
        ]);
        console.log(`✅ Created ${merchants.length} merchants`);

        // Create merchant wallets and profiles
        await Promise.all([
            Wallet.create({ userId: merchants[0].id, balance: 150000 }),
            Wallet.create({ userId: merchants[1].id, balance: 85000 }),
            Wallet.create({ userId: merchants[2].id, balance: 25000 }),
            Wallet.create({ userId: merchants[3].id, balance: 62000 })
        ]);

        await Promise.all([
            Merchant.create({
                userId: merchants[0].id,
                businessName: 'Campus Cafeteria',
                businessType: 'Food & Beverage',
                location: 'Main Building, Ground Floor',
                commissionRate: 1.5
            }),
            Merchant.create({
                userId: merchants[1].id,
                businessName: 'Campus Bookstore',
                businessType: 'Retail',
                location: 'Library Building',
                commissionRate: 2.0
            }),
            Merchant.create({
                userId: merchants[2].id,
                businessName: 'Print & Copy Center',
                businessType: 'Services',
                location: 'Admin Block',
                commissionRate: 1.0
            }),
            Merchant.create({
                userId: merchants[3].id,
                businessName: 'Campus Pharmacy',
                businessType: 'Healthcare',
                location: 'Health Center',
                commissionRate: 1.5
            })
        ]);
        console.log('✅ Created merchant profiles');

        // Create Admin
        const admin = await User.create({
            studentId: 'ADM001',
            name: 'System Administrator',
            email: 'admin@campus.edu',
            phone: '08001234567',
            pin: hashedPin,
            role: 'admin',
            status: 'active'
        });
        await Wallet.create({ userId: admin.id, balance: 0 });
        console.log('✅ Created admin user');

        // Create sample transactions
        const now = new Date();
        const generateRef = () => `REF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        const sampleTransactions = [
            {
                transactionRef: generateRef(),
                senderId: students[0].id,
                senderName: 'John Doe',
                receiverId: merchants[0].id,
                receiverName: 'Campus Cafeteria',
                amount: 1500,
                fee: 0,
                type: 'payment',
                status: 'completed',
                description: 'Lunch - Rice and Chicken',
                category: 'Food & Beverage',
                completedAt: new Date(now - 3600000)
            },
            {
                transactionRef: generateRef(),
                senderId: students[1].id,
                senderName: 'Sarah Johnson',
                receiverId: merchants[1].id,
                receiverName: 'Campus Bookstore',
                amount: 4500,
                fee: 0,
                type: 'payment',
                status: 'completed',
                description: 'Textbook - Introduction to Economics',
                category: 'Retail',
                completedAt: new Date(now - 7200000)
            },
            {
                transactionRef: generateRef(),
                senderId: students[0].id,
                senderName: 'John Doe',
                receiverId: students[1].id,
                receiverName: 'Sarah Johnson',
                amount: 2000,
                fee: 0,
                type: 'transfer',
                status: 'completed',
                description: 'Group project supplies',
                category: 'Transfer',
                completedAt: new Date(now - 86400000)
            },
            {
                transactionRef: generateRef(),
                senderId: students[2].id,
                senderName: 'Michael Chen',
                receiverId: merchants[0].id,
                receiverName: 'Campus Cafeteria',
                amount: 800,
                fee: 0,
                type: 'payment',
                status: 'completed',
                description: 'Breakfast',
                category: 'Food & Beverage',
                completedAt: new Date(now - 10800000)
            },
            {
                transactionRef: generateRef(),
                senderId: students[3].id,
                senderName: 'Emily Brown',
                receiverId: merchants[2].id,
                receiverName: 'Print & Copy Center',
                amount: 350,
                fee: 0,
                type: 'payment',
                status: 'completed',
                description: 'Print assignment - 35 pages',
                category: 'Services',
                completedAt: new Date(now - 172800000)
            }
        ];

        await Transaction.bulkCreate(sampleTransactions);
        console.log(`✅ Created ${sampleTransactions.length} sample transactions`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Demo Credentials:');
        console.log('   Students: STU001, STU002, STU003, STU004, STU005 (PIN: 1234)');
        console.log('   Merchants: MER001, MER002, MER003, MER004 (PIN: 1234)');
        console.log('   Admin: ADM001 (PIN: 1234)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
