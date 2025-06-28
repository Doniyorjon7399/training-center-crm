export default () => ({
  jwt_config: {
    secret: process.env.JWT_SECRET_KEY,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
  },
});
  