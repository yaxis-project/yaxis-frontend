
export const Languages = <const>[
    'EN',
    'KO',
    'JA',
    'ZH',
    'RU',
]

export type TLanguages = typeof Languages[number]

interface TLanguagesDisplay {
    flag: string
    name: string
    key: string
}

export const LanguagesDisplay: { [L in TLanguages]: TLanguagesDisplay } = <const>{
    'EN': { flag: '🇺🇸', name: 'English', key: 'EN' },
    'KO': { flag: '🇰🇷', name: 'Korean', key: 'KO' },
    'JA': { flag: '🇯🇵', name: 'Japanese', key: 'JA' },
    'ZH': { flag: '🇨🇳', name: 'Chinese', key: 'ZH' },
    'RU': { flag: '🇷🇺', name: 'Russian', key: 'RU' },
}

export type Phrases = 'Asset' |
    'From' |
    'To Wallet' |
    'Convert' |
    'You have' |
    'Total APY' |
    'Amount' |
    'Wallet Balance' |
    'Returns' |
    'Total' |
    'Deposit' |
    'Approve' |
    'Withdraw Fee' |
    'Investment Account' |
    'Please confirm withdraw transaction.' |
    "You'll receive an estimate of" |
    'An error has occured. Please try again.' |
    'Available' |
    "You'll Receive" |
    'Withdraw' |
    'Recent Transactions' |
    'Account Overview' |
    'Clear all' |
    'Weekly Average APY' |
    'Return' |
    'Available Balance' |
    'Staked Balance' |
    'Staking' |
    'Stake' |
    'Unstake' |
    'Error while withdrawing:' |
    // Languages
    'English' |
    'Korean' |
    'Japanese' |
    'Chinese' |
    'Russian'

export type Translations = {
    [P in Phrases]: string
}
export type Dictionary = {
    [L in TLanguages]: Translations
}


const EN: Translations = {
    Asset:
        'Asset',
    From:
        'From',
    'To Wallet':
        'To Wallet',
    Convert:
        'Convert',
    'You have':
        'You have',
    'Total APY':
        'Total APY',
    Amount:
        'Amount',
    'Wallet Balance':
        'Wallet Balance',
    Returns:
        'Returns',
    Total:
        'Total',
    Deposit:
        'Deposit',
    Approve:
        'Approve',
    'Withdraw Fee':
        'Withdraw Fee',
    'Investment Account':
        'Investment Account',
    'Please confirm withdraw transaction.':
        'Please confirm withdraw transaction.',
    "You'll receive an estimate of":
        "You'll receive an estimate of",
    'An error has occured. Please try again.':
        'An error has occured. Please try again.',
    'Error while withdrawing:':
        'Error while withdrawing:',
    Available:
        'Available',
    "You'll Receive":
        "You'll Receive",
    Withdraw:
        'Withdraw',
    'Recent Transactions':
        'Recent Transactions',
    'Account Overview':
        'Account Overview',
    'Clear all':
        'Clear all',
    'Weekly Average APY':
        'Weekly Average APY',
    Return:
        'Return',
    'Available Balance':
        'Available Balance',
    'Staked Balance':
        'Staked Balance',
    Staking:
        'Staking',
    Stake:
        'Stake',
    Unstake:
        'Unstake',
    'English': 'English',
    'Korean': 'Korean',
    'Japanese': 'Japanese',
    'Chinese': 'Chinese',
    'Russian': 'Russian',
}

const KO: Translations = {
    Asset:
        '',
    From:
        '',
    'To Wallet':
        '',
    Convert:
        '',
    'You have':
        '',
    'Total APY':
        '',
    Amount:
        '',
    'Wallet Balance':
        '',
    Returns:
        '',
    Total:
        '',
    Deposit:
        '',
    Approve:
        '',
    'Withdraw Fee':
        '',
    'Investment Account':
        '',
    'Please confirm withdraw transaction.':
        '',
    "You'll receive an estimate of":
        "",
    'An error has occured. Please try again.':
        '',
    'Error while withdrawing:':
        '',
    Available:
        '',
    "You'll Receive":
        "",
    Withdraw:
        '',
    'Recent Transactions':
        '',
    'Account Overview':
        '',
    'Clear all':
        '',
    'Weekly Average APY':
        '',
    Return:
        '',
    'Available Balance':
        '',
    'Staked Balance':
        '',
    Staking:
        '',
    Stake:
        '',
    Unstake:
        '',
    'English': '',
    'Korean': '',
    'Japanese': '',
    'Chinese': '',
    'Russian': '',
}

const ZH: Translations = {
    Asset:
        '',
    From:
        '',
    'To Wallet':
        '',
    Convert:
        '',
    'You have':
        '',
    'Total APY':
        '',
    Amount:
        '',
    'Wallet Balance':
        '',
    Returns:
        '',
    Total:
        '',
    Deposit:
        '',
    Approve:
        '',
    'Withdraw Fee':
        '',
    'Investment Account':
        '',
    'Please confirm withdraw transaction.':
        '',
    "You'll receive an estimate of":
        "",
    'An error has occured. Please try again.':
        '',
    'Error while withdrawing:':
        '',
    Available:
        '',
    "You'll Receive":
        "",
    Withdraw:
        '',
    'Recent Transactions':
        '',
    'Account Overview':
        '',
    'Clear all':
        '',
    'Weekly Average APY':
        '',
    Return:
        '',
    'Available Balance':
        '',
    'Staked Balance':
        '',
    Staking:
        '',
    Stake:
        '',
    Unstake:
        '',
    'English': '',
    'Korean': '',
    'Japanese': '',
    'Chinese': '',
    'Russian': '',
}

const RU: Translations = {
    Asset:
        '',
    From:
        '',
    'To Wallet':
        '',
    Convert:
        '',
    'You have':
        '',
    'Total APY':
        '',
    Amount:
        '',
    'Wallet Balance':
        '',
    Returns:
        '',
    Total:
        '',
    Deposit:
        '',
    Approve:
        '',
    'Withdraw Fee':
        '',
    'Investment Account':
        '',
    'Please confirm withdraw transaction.':
        '',
    "You'll receive an estimate of":
        "",
    'An error has occured. Please try again.':
        '',
    'Error while withdrawing:':
        '',
    Available:
        '',
    "You'll Receive":
        "",
    Withdraw:
        '',
    'Recent Transactions':
        '',
    'Account Overview':
        '',
    'Clear all':
        '',
    'Weekly Average APY':
        '',
    Return:
        '',
    'Available Balance':
        '',
    'Staked Balance':
        '',
    Staking:
        '',
    Stake:
        '',
    Unstake:
        '',
    'English': '',
    'Korean': '',
    'Japanese': '',
    'Chinese': '',
    'Russian': '',
}

const JA: Translations = {
    Asset:
        '',
    From:
        '',
    'To Wallet':
        '',
    Convert:
        '',
    'You have':
        '',
    'Total APY':
        '',
    Amount:
        '',
    'Wallet Balance':
        '',
    Returns:
        '',
    Total:
        '',
    Deposit:
        '',
    Approve:
        '',
    'Withdraw Fee':
        '',
    'Investment Account':
        '',
    'Please confirm withdraw transaction.':
        '',
    "You'll receive an estimate of":
        "",
    'An error has occured. Please try again.':
        '',
    'Error while withdrawing:':
        '',
    Available:
        '',
    "You'll Receive":
        "",
    Withdraw:
        '',
    'Recent Transactions':
        '',
    'Account Overview':
        '',
    'Clear all':
        '',
    'Weekly Average APY':
        '',
    Return:
        '',
    'Available Balance':
        '',
    'Staked Balance':
        '',
    Staking:
        '',
    Stake:
        '',
    Unstake:
        '',
    'English': '',
    'Korean': '',
    'Japanese': '',
    'Chinese': '',
    'Russian': '',
}

const dictionary: Dictionary = {
    EN,
    KO,
    JA,
    ZH,
    RU,
}

export default dictionary
