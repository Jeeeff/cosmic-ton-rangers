// Validações gerais
function isValidTelegramId(telegramId) {
  return /^\d+$/.test(telegramId);
}

function isValidTonAddress(address) {
  return /^(EQ|UQ)[A-Za-z0-9_-]{46}$/.test(address);
}

function isValidAmount(amount) {
  return typeof amount === 'number' && amount > 0;
}

module.exports = {
  isValidTelegramId,
  isValidTonAddress,
  isValidAmount
};