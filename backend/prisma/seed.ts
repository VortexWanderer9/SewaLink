import { PrismaClient, Role, VerificationStatus, BookingStatus, PaymentStatus, PaymentMethod, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const NEPALI_DISTRICTS = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar',
  'Chitwan', 'Butwal', 'Nepalgunj', 'Dhangadhi', 'Bharatpur',
  'Hetauda', 'Itahari', 'Dharan', 'Birgunj', 'Janakpur'
];

const KATHMANDU_AREAS = [
  'Baneshwor', 'Boudha', 'Thamel', 'Durbar Marg', 'Koteshwor',
  'Patan', 'Jawalakhel', 'Bhainsepati', 'Kalanki', 'Balaju',
  'Chabahil', 'Gaushala', 'Maitidevi', 'Putalisadak', 'New Road'
];

const CATEGORIES = [
  { slug: 'electrician', name: 'Electrician', nameNe: 'बिजुली मिस्त्री', blurb: 'Wiring, switchboards, fault repair', avgPrice: 'Rs 500–1,500', iconName: 'Zap' },
  { slug: 'plumber', name: 'Plumber', nameNe: 'प्लम्बर', blurb: 'Leaks, pipe fitting, geysers', avgPrice: 'Rs 400–1,800', iconName: 'Wrench' },
  { slug: 'carpenter', name: 'Carpenter', nameNe: 'सिकर्मी', blurb: 'Furniture repair, custom woodwork', avgPrice: 'Rs 600–3,000', iconName: 'Hammer' },
  { slug: 'painter', name: 'Painter', nameNe: 'रंगकर्मी', blurb: 'Interior & exterior painting', avgPrice: 'Rs 15/sq.ft', iconName: 'Paintbrush' },
  { slug: 'ac-technician', name: 'AC Technician', nameNe: 'एसी टेक्निसियन', blurb: 'Servicing, gas refill, installation', avgPrice: 'Rs 1,200–3,500', iconName: 'Wind' },
  { slug: 'cctv', name: 'CCTV Installer', nameNe: 'सीसीटीभी', blurb: 'Setup, repair, remote access', avgPrice: 'Rs 2,000–6,000', iconName: 'Camera' },
  { slug: 'mechanic', name: 'Vehicle Mechanic', nameNe: 'मेकानिक', blurb: 'Bike & car servicing, doorstep repair', avgPrice: 'Rs 500–2,500', iconName: 'Car' },
  { slug: 'tutor', name: 'Home Tutor', nameNe: 'ट्युटर', blurb: 'School, +2, entrance prep', avgPrice: 'Rs 800–2,000/mo', iconName: 'GraduationCap' },
  { slug: 'cleaner', name: 'Deep Cleaning', nameNe: 'सरसफाई', blurb: 'Home, kitchen, sofa & carpet', avgPrice: 'Rs 1,500–4,000', iconName: 'Sparkles' },
  { slug: 'mover', name: 'Movers & Packers', nameNe: 'सरसामान सार्ने', blurb: 'Local shifting, loading, unloading', avgPrice: 'Rs 3,000–12,000', iconName: 'Truck' },
  { slug: 'photographer', name: 'Photographer', nameNe: 'फोटोग्राफर', blurb: 'Events, portraits, real estate', avgPrice: 'Rs 5,000+/event', iconName: 'Camera' },
  { slug: 'pest-control', name: 'Pest Control', nameNe: 'किरा नियन्त्रण', blurb: 'Termite, cockroach, rodent', avgPrice: 'Rs 1,800–4,500', iconName: 'Bug' },
];

const NEPALI_FIRST_NAMES = [
  'Bishnu', 'Sita', 'Ramesh', 'Hari', 'Puja', 'Dipesh', 'Anita', 'Sagar',
  'Meena', 'Krishna', 'Laxmi', 'Rajesh', 'Sunita', 'Sanjay', 'Kamala',
  'Govinda', 'Radha', 'Bikash', 'Shova', 'Nabin', 'Sabita', 'Santosh',
  'Devi', 'Buddhi', 'Samjhana', 'Prakash', 'Rekha', 'Jivan', 'Manju', 'Shyam'
];

const NEPALI_LAST_NAMES = [
  'Shrestha', 'Tamang', 'Koirala', 'Magar', 'Rai', 'Gurung', 'Thapa',
  'KC', 'Adhikari', 'Gautam', 'Bhattarai', 'Nepali', 'Karki', 'Lama',
  'Maharjan', 'Tuladhar', 'Shakya', 'Rijal', 'Acharya', 'Khadka'
];

const GULF_COUNTRIES = ['Qatar', 'UAE', 'Saudi Arabia', 'Kuwait', 'Oman', 'Malaysia'];

const CITIZEN_FIRST_NAMES = [
  'Rajesh', 'Anita', 'Suresh', 'Binita', 'Deepak', 'Rejina', 'Manish',
  'Priyanka', 'Bipin', 'Sasmita', 'Rupesh', 'Asha', 'Suman', 'Rina'
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomCount<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  console.log('Seeding categories...');
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        name: cat.name,
        nameNe: cat.nameNe,
        blurb: cat.blurb,
        avgPrice: cat.avgPrice,
        iconName: cat.iconName,
      },
    });
  }

  console.log('Seeding badges...');
  const badges = await Promise.all([
    prisma.badge.upsert({ where: { name: 'Top Rated' }, update: {}, create: { name: 'Top Rated', description: 'Consistent 4.8+ rating over 50+ jobs', color: '#f59e0b' } }),
    prisma.badge.upsert({ where: { name: 'Fast Responder' }, update: {}, create: { name: 'Fast Responder', description: 'Responds within 15 minutes on average', color: '#10b981' } }),
    prisma.badge.upsert({ where: { name: 'Qatar-trained' }, update: {}, create: { name: 'Qatar-trained', description: 'Worked in Qatar', color: '#8b5cf6' } }),
    prisma.badge.upsert({ where: { name: 'Malaysia-trained' }, update: {}, create: { name: 'Malaysia-trained', description: 'Worked in Malaysia', color: '#6366f1' } }),
    prisma.badge.upsert({ where: { name: 'Parent Favorite' }, update: {}, create: { name: 'Parent Favorite', description: 'Highly rated by parents for tutoring', color: '#ec4899' } }),
  ]);

  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { phone: '+9779800000000' },
    update: {},
    create: {
      role: Role.ADMIN,
      phone: '+9779800000000',
      email: 'admin@sewalinknepal.com',
      passwordHash: adminPassword,
      fullName: 'SewaLink Admin',
      isEmailVerified: true,
      isPhoneVerified: true,
      avatarUrl: null,
    },
  });

  console.log('Creating workers...');
  const workers: { user: any; profile: any }[] = [];
  for (let i = 0; i < 24; i++) {
    const firstName = pickRandom(NEPALI_FIRST_NAMES);
    const lastName = pickRandom(NEPALI_LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    const phone = `+97798${String(10000000 + i * 137).slice(-8)}`;
    const category = CATEGORIES[i % CATEGORIES.length];
    const district = pickRandom(NEPALI_DISTRICTS);
    const area = pickRandom(KATHMANDU_AREAS);
    const location = `${district} — ${area}`;
    const yearsExp = 2 + (i % 15);
    const gulfReturnee = i % 3 === 0;
    const rating = gulfReturnee ? 4.6 + (i % 4) * 0.1 : 4.2 + (i % 7) * 0.1;
    const priceFrom = [500, 400, 600, 1500, 1200, 2000, 500, 800, 1500, 3000, 5000, 1800][i % 12];
    const isVerified = i < 18;
    const password = await bcrypt.hash('Worker@123', 10);
    const avatarInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

    const user = await prisma.user.create({
      data: {
        role: Role.WORKER,
        phone,
        email: isVerified ? `worker${i}@sewalinknepal.com` : null,
        passwordHash: password,
        fullName,
        isPhoneVerified: true,
        isEmailVerified: isVerified,
      },
    });

    const profile = await prisma.workerProfile.create({
      data: {
        userId: user.id,
        categorySlug: category.slug,
        bio: `${yearsExp}+ years of experience as a ${category.name.toLowerCase()} in Nepal. ${gulfReturnee ? `Returned from ${pickRandom(GULF_COUNTRIES)} after working there for several years. ` : ''}Known for reliable service and fair pricing.`,
        yearsExperience: yearsExp,
        priceFrom: priceFrom,
        priceTo: priceFrom * 3,
        location,
        verificationStatus: isVerified ? VerificationStatus.VERIFIED : i < 21 ? VerificationStatus.IN_REVIEW : VerificationStatus.PENDING,
        verifiedAt: isVerified ? new Date() : null,
        rating: Math.round(rating * 10) / 10,
        totalReviews: isVerified ? 15 + (i * 7) % 800 : 0,
        totalJobsDone: isVerified ? 30 + (i * 13) % 800 : 0,
        totalEarnings: isVerified ? priceFrom * (30 + (i * 13) % 800) * 0.85 : 0,
        responseTimeMinutes: 5 + (i * 3) % 55,
        isOnline: i % 4 === 0,
        lastOnlineAt: new Date(Date.now() - Math.random() * 86400000),
        gulfReturnee,
        foreignCountryExp: gulfReturnee ? pickRandom(GULF_COUNTRIES) : null,
      },
    });

    const badgeCount = isVerified ? 1 + (i % 3) : 0;
    const selectedBadges = pickRandomCount(badges, badgeCount);
    for (const badge of selectedBadges) {
      await prisma.workerBadge.create({
        data: { workerProfileId: profile.id, badgeId: badge.id, awardedBy: admin.id },
      });
    }

    const days = [0, 1, 2, 3, 4, 5, 6];
    for (const day of days) {
      await prisma.availability.create({
        data: {
          workerProfileId: profile.id,
          dayOfWeek: day,
          startTime: day === 6 ? '09:00' : '08:00',
          endTime: day === 6 ? '17:00' : '19:00',
          isAvailable: day !== 0,
        },
      });
    }

    workers.push({ user, profile });
  }

  console.log('Creating customers...');
  const customers: any[] = [];
  for (let i = 0; i < 30; i++) {
    const firstName = pickRandom(CITIZEN_FIRST_NAMES);
    const lastName = pickRandom(NEPALI_LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    const phone = `+97798${String(30000000 + i * 123).slice(-8)}`;
    const password = await bcrypt.hash('Customer@123', 10);

    const user = await prisma.user.create({
      data: {
        role: Role.CUSTOMER,
        phone,
        email: i % 3 === 0 ? `customer${i}@email.com` : null,
        passwordHash: password,
        fullName,
        isPhoneVerified: true,
        isEmailVerified: i % 3 === 0,
      },
    });

    const cp = await prisma.customerProfile.create({
      data: {
        userId: user.id,
        referralCode: `REF${i}${lastName.toUpperCase().slice(0, 3)}`,
        referredById: i > 10 && i % 4 === 0 ? customers[i - 10]?.id : null,
      },
    });

    const numAddresses = 1 + (i % 3);
    for (let a = 0; a < numAddresses; a++) {
      await prisma.address.create({
        data: {
          userId: user.id,
          label: a === 0 ? 'Home' : a === 1 ? 'Office' : `${pickRandom(KATHMANDU_AREAS)} place`,
          fullAddress: `House ${100 + i * 7 + a * 3}, Ward ${1 + (i % 10)}, ${pickRandom(KATHMANDU_AREAS)}, ${pickRandom(NEPALI_DISTRICTS)}`,
          city: pickRandom(KATHMANDU_AREAS),
          district: pickRandom(NEPALI_DISTRICTS),
          ward: String(1 + (i % 10)),
          isDefault: a === 0,
          phone: phone,
          instructions: a === 0 ? 'Ring the bell twice, blue gate' : null,
        },
      });
    }

    if (i % 5 === 0) {
      const favWorker = workers[(i + 3) % workers.length];
      await prisma.favoriteWorker.create({
        data: { customerId: user.id, workerProfileId: favWorker.profile.id },
      });
    }

    customers.push({ ...user, customerProfile: cp });
  }

  console.log('Creating bookings...');
  for (let i = 0; i < 60; i++) {
    const customer = customers[i % customers.length];
    const worker = workers[i % workers.length];
    const customerAddresses = await prisma.address.findMany({ where: { userId: customer.id } });
    const primaryAddress = customerAddresses[0];
    const daysAgo = i < 50 ? i + 1 : -(i - 49);
    const scheduledAt = new Date(Date.now() + daysAgo * 86400000 + (10 + (i % 10)) * 3600000);
    const statuses: BookingStatus[] = [
      BookingStatus.COMPLETED, BookingStatus.COMPLETED, BookingStatus.COMPLETED,
      BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.ACCEPTED,
      BookingStatus.PENDING, BookingStatus.IN_PROGRESS, BookingStatus.EN_ROUTE,
    ];
    const status = i < 50 ? statuses[i % statuses.length] : BookingStatus.PENDING;
    const basePrice = worker.profile.priceFrom.toNumber() + ((i * 77) % 1500);
    const partsPrice = i % 4 === 0 ? ((i * 123) % 5000) : 0;
    const tipAmount = i % 6 === 0 ? 100 + (i % 5) * 50 : 0;
    const platformFee = Math.round((basePrice + partsPrice) * 0.15);
    const totalAmount = basePrice + partsPrice + tipAmount + platformFee;
    const workerEarnings = basePrice + partsPrice + tipAmount - platformFee;

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        workerId: worker.user.id,
        categorySlug: worker.profile.categorySlug,
        addressId: primaryAddress?.id,
        status,
        scheduledAt,
        durationMinutes: 60 + ((i * 17) % 180),
        addressText: primaryAddress?.fullAddress || 'On-site',
        description: `Need help with typical ${worker.profile.categorySlug} service issues at my place.`,
        notes: i % 5 === 0 ? 'Please bring your own tools' : null,
        basePrice,
        partsPrice,
        tipAmount,
        platformFee,
        totalAmount,
        workerEarnings,
        paidAt: status === BookingStatus.COMPLETED ? new Date(scheduledAt.getTime() + 3 * 3600000) : null,
        completedAt: status === BookingStatus.COMPLETED ? new Date(scheduledAt.getTime() + 2 * 3600000) : null,
        cancelledAt: status === BookingStatus.CANCELLED ? new Date(scheduledAt.getTime() - 86400000) : null,
        cancelledBy: status === BookingStatus.CANCELLED ? (i % 2 === 0 ? 'CUSTOMER' : 'WORKER') : null,
        cancelReason: status === BookingStatus.CANCELLED ? 'Schedule conflict' : null,
        arrivedAt: [BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED].includes(status) ? new Date(scheduledAt.getTime() - 5 * 60000) : null,
        startedAt: [BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED].includes(status) ? new Date(scheduledAt.getTime() + 5 * 60000) : null,
      },
    });

    if ([BookingStatus.COMPLETED, BookingStatus.IN_PROGRESS, BookingStatus.EN_ROUTE, BookingStatus.ACCEPTED].includes(status)) {
      const method = i % 4 === 0 ? PaymentMethod.CASH : [PaymentMethod.ESEWA, PaymentMethod.KHALTI, PaymentMethod.IMEPAY][i % 3];
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: totalAmount,
          method,
          status: status === BookingStatus.COMPLETED ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
          transactionId: status === BookingStatus.COMPLETED ? `TXN${100000 + i}` : null,
          gateway: method === PaymentMethod.CASH ? null : method,
          paidAt: status === BookingStatus.COMPLETED ? new Date(scheduledAt.getTime() + 3 * 3600000) : null,
        },
      });
    }

    if (status === BookingStatus.COMPLETED && i % 3 !== 0) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          authorId: customer.id,
          subjectId: worker.user.id,
          isWorker: true,
          rating: 3 + (i % 3),
          comment: pickRandom([
            'Arrived on time, work was done well. Would hire again!',
            'Professional and friendly. Explained everything before starting.',
            'Great job, fair price. Happy with the service.',
            'Fixed the issue quickly. Thank you!',
            'Very experienced, you can tell they have been doing this for years.',
          ]),
        },
      });
    }

    if (status === BookingStatus.COMPLETED) {
      await prisma.earning.create({
        data: {
          userId: worker.user.id,
          bookingId: booking.id,
          amount: workerEarnings,
          type: 'BOOKING',
          description: `Earnings for booking #${booking.id.slice(-6)}`,
          payoutStatus: i < 40 ? 'PAID' : 'PENDING',
          earnedAt: new Date(scheduledAt.getTime() + 2 * 3600000),
        },
      });
    }

    const notifTypes: NotificationType[] = [NotificationType.BOOKING_CREATED];
    if (status !== BookingStatus.PENDING) {
      notifTypes.push(NotificationType.BOOKING_UPDATED);
    }
    for (const nt of notifTypes) {
      await prisma.notification.create({
        data: {
          userId: i % 2 === 0 ? customer.id : worker.user.id,
          type: nt,
          title: nt === NotificationType.BOOKING_CREATED ? 'New booking request' : 'Booking updated',
          body: nt === NotificationType.BOOKING_CREATED
            ? `${customer.fullName} has requested your service`
            : `Booking status is now ${status}`,
          isRead: i % 3 !== 0,
        },
      });
    }
  }

  console.log('Creating audit logs...');
  for (let i = 0; i < 25; i++) {
    await prisma.auditLog.create({
      data: {
        userId: i < 20 ? pickRandom([admin, ...customers.map(c => c), ...workers.map(w => w.user)]).id : null,
        action: pickRandom(['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE']),
        entityType: pickRandom(['USER', 'BOOKING', 'PAYMENT', 'WORKER_PROFILE', 'REVIEW']),
        ipAddress: `192.168.${i % 255}.${i % 100}`,
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log('Admin login: +9779800000000 / Admin@123');
  console.log('Worker test login: +9779810000001 / Worker@123');
  console.log('Customer test login: +9779830000001 / Customer@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
