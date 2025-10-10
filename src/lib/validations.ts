// Utilidades de validación para formularios

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { valid: false, error: 'Email es requerido' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email inválido' };
  }
  
  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'Password es requerido' };
  }
  
  if (password.length < 6) {
    return { valid: false, error: 'Password debe tener al menos 6 caracteres' };
  }
  
  return { valid: true };
};

export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username) {
    return { valid: false, error: 'Username es requerido' };
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'Username debe tener al menos 3 caracteres' };
  }
  
  if (username.length > 30) {
    return { valid: false, error: 'Username no puede exceder 30 caracteres' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: 'Username solo puede contener letras, números, _ y -' };
  }
  
  return { valid: true };
};

export const validatePostTitle = (title: string): { valid: boolean; error?: string } => {
  if (!title) {
    return { valid: false, error: 'Título es requerido' };
  }
  
  if (title.length < 3) {
    return { valid: false, error: 'Título debe tener al menos 3 caracteres' };
  }
  
  if (title.length > 200) {
    return { valid: false, error: 'Título no puede exceder 200 caracteres' };
  }
  
  return { valid: true };
};

export const validatePostContent = (content: string): { valid: boolean; error?: string } => {
  if (!content) {
    return { valid: false, error: 'Contenido es requerido' };
  }
  
  if (content.length < 10) {
    return { valid: false, error: 'Contenido debe tener al menos 10 caracteres' };
  }
  
  if (content.length > 5000) {
    return { valid: false, error: 'Contenido no puede exceder 5000 caracteres' };
  }
  
  return { valid: true };
};

export const validatePrice = (price: string | number): { valid: boolean; error?: string } => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return { valid: false, error: 'Precio debe ser un número válido' };
  }
  
  if (numPrice <= 0) {
    return { valid: false, error: 'Precio debe ser mayor a 0' };
  }
  
  return { valid: true };
};

export const validateAmount = (amount: string | number): { valid: boolean; error?: string } => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return { valid: false, error: 'Cantidad debe ser un número válido' };
  }
  
  if (numAmount <= 0) {
    return { valid: false, error: 'Cantidad debe ser mayor a 0' };
  }
  
  return { valid: true };
};

export const validateCoinId = (coinId: string): { valid: boolean; error?: string } => {
  if (!coinId) {
    return { valid: false, error: 'Coin ID es requerido' };
  }
  
  const coinIdRegex = /^[a-z0-9-]+$/;
  if (!coinIdRegex.test(coinId)) {
    return { valid: false, error: 'Coin ID solo puede contener letras minúsculas, números y guiones' };
  }
  
  return { valid: true };
};

export const validateCoinSymbol = (symbol: string): { valid: boolean; error?: string } => {
  if (!symbol) {
    return { valid: false, error: 'Símbolo es requerido' };
  }
  
  if (symbol.length > 10) {
    return { valid: false, error: 'Símbolo no puede exceder 10 caracteres' };
  }
  
  return { valid: true };
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato inválido. Usa JPG, PNG, GIF o WebP' };
  }
  
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen debe ser menor a 2MB' };
  }
  
  return { valid: true };
};

export const validateURL = (url: string): { valid: boolean; error?: string } => {
  if (!url) {
    return { valid: true }; // URL es opcional
  }
  
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'URL inválida' };
  }
};

export const validateBio = (bio: string): { valid: boolean; error?: string } => {
  if (bio && bio.length > 500) {
    return { valid: false, error: 'Bio no puede exceder 500 caracteres' };
  }
  
  return { valid: true };
};
