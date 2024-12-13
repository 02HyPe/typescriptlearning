declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URL: string;
    PORT: string;
    ACCESS_TOKEN_SECERET: string;
    REFRESH_TOKEN_SECERET: string;
  }
}
