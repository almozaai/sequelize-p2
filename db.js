const Sequelize = require('sequelize');
const { DECIMAL, UUID, UUIDV4, STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/users_stories_reviews_db');

const uuidDefinition = {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
}

const User = conn.define('user', {
    id: uuidDefinition,
    firstName: {
        type: STRING,
        allowNull: false
    },
    lastName: {
        type: STRING,
        allowNull: false 
    }
});
const Story = conn.define('story', {
    id: uuidDefinition,
    title: {
        type: STRING,
        allowNull: false
    }
});
const Review = conn.define('review', {
    id: uuidDefinition,
    rating: DECIMAL
});

Story.belongsTo(User, { as: 'author' });
User.hasMany(Story, { foreignKey: 'authorId' });

Review.belongsTo(User, { as: 'reviewer' });
User.hasMany(Review, { foreignKey: 'reviewerId' });

Review.belongsTo(Story);
Story.hasMany(Review);

const mapPromise = (items, model) => Promise.all(items.map(item => model.create(item)))

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    const users = [
        { firstName: 'moe', lastName: 'green' },
        { firstName: 'larry', lastName: 'blue' },
        { firstName: 'curly', lastName: 'red' }
    ]
     const [moem, larry, curly]= await mapPromise(users, User)
};

syncAndSeed()
    .then(() => console.log('success'))
    .catch(ex => console.log('ex'))

