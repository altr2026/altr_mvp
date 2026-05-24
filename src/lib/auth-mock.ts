const FREE_EMAIL_DOMAINS = new Set<string>([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.kr',
  'yahoo.co.jp',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'mail.com',
  'gmx.com',
  'gmx.de',
  'zoho.com',
  'yandex.com',
  'yandex.ru',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'nate.com',
  'kakao.com',
  'qq.com',
  '163.com',
  '126.com',
  'sina.com',
  'foxmail.com',
])

const REGISTERED_COHORT = new Set<string>([
  'founder@altr.haus',
  'demo@altr.haus',
  'partners@altr.haus',
  'lumi@lumibeauty.co',
  'pr@hansiktable.com',
  'bd@studioneon.io',
])

const REGISTERED_WALLETS = new Set<string>([
  '0xa1b2c3d4e5f60718',
  '0xdeadbeefcafe1234',
])

export function isBusinessEmail(email: string): boolean {
  if (!email.includes('@')) return false
  const lower = email.trim().toLowerCase()
  const domain = lower.split('@')[1]
  if (!domain || domain.length < 3) return false
  return !FREE_EMAIL_DOMAINS.has(domain)
}

export function isRegisteredEmail(email: string): boolean {
  return REGISTERED_COHORT.has(email.trim().toLowerCase())
}

export function isRegisteredWallet(walletAddress: string): boolean {
  return REGISTERED_WALLETS.has(walletAddress.trim().toLowerCase())
}

export function maskAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
