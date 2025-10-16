export default {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.collection('jobapplications').updateMany({ city: { $exists: true } }, [
      {
        $set: { location: '$city' },
      },
      {
        $unset: 'city',
      },
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection('jobapplications').updateMany({ location: { $exists: true } }, [
      {
        $set: { city: '$location' },
      },
      {
        $unset: 'location',
      },
    ]);
  },
};
