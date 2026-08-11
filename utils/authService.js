import { clearTokens } from './authStorage';

export const logout = async () => {
  await clearTokens();
  // Component calling this should then do: router.replace('/(auth)/login')
};