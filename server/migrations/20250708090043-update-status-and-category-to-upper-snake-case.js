// migrations/XXXXXXXXX-update-status-and-category-to-upper-snake-case.js

export default {
  async up(db) {
    // Status mapping
    const statusMap = {
      Sent: 'SENT',
      'Followed up': 'FOLLOWED_UP',
      'Interview scheduled': 'INTERVIEW_SCHEDULED',
      Accepted: 'ACCEPTED',
      Rejected: 'REJECTED',
    };

    // Category mapping
    const categoryMap = {
      Internship: 'INTERNSHIP',
      Apprenticeship: 'APPRENTICESHIP',
      'Full-time': 'FULL_TIME',
      'Part-time': 'PART_TIME',
      Freelance: 'FREELANCE',
      Contract: 'CONTRACT',
      Seasonal: 'SEASONAL',
    };

    // Update status
    for (const [oldStatus, newStatus] of Object.entries(statusMap)) {
      await db.collection('jobapplications').updateMany({ status: oldStatus }, { $set: { status: newStatus } });
    }

    // Update category
    for (const [oldCategory, newCategory] of Object.entries(categoryMap)) {
      await db.collection('jobapplications').updateMany({ category: oldCategory }, { $set: { category: newCategory } });
    }

    // Update preferredCategory in users
    for (const [oldCategory, newCategory] of Object.entries(categoryMap)) {
      await db
        .collection('users')
        .updateMany({ preferredCategory: oldCategory }, { $set: { preferredCategory: newCategory } });
    }
  },

  async down(db) {
    // Reverse status mapping
    const statusMap = {
      SENT: 'Sent',
      FOLLOWED_UP: 'Followed up',
      INTERVIEW_SCHEDULED: 'Interview scheduled',
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
    };

    // Reverse category mapping
    const categoryMap = {
      INTERNSHIP: 'Internship',
      APPRENTICESHIP: 'Apprenticeship',
      FULL_TIME: 'Full-time',
      PART_TIME: 'Part-time',
      FREELANCE: 'Freelance',
      CONTRACT: 'Contract',
      SEASONAL: 'Seasonal',
    };

    // Revert status
    for (const [newStatus, oldStatus] of Object.entries(statusMap)) {
      await db.collection('jobapplications').updateMany({ status: newStatus }, { $set: { status: oldStatus } });
    }

    // Revert category
    for (const [newCategory, oldCategory] of Object.entries(categoryMap)) {
      await db.collection('jobapplications').updateMany({ category: newCategory }, { $set: { category: oldCategory } });
    }

    // Revert preferredCategory in users
    for (const [newCategory, oldCategory] of Object.entries(categoryMap)) {
      await db
        .collection('users')
        .updateMany({ preferredCategory: newCategory }, { $set: { preferredCategory: oldCategory } });
    }
  },
};
