export default () => ({
  JWT_SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.EXPIRES_IN,
  PORT: process.env.PORT,
});