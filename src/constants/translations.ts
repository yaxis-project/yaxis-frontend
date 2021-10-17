
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

export type Phrases =
    // Phrases
    "Asset"
    | "From"
    | "To Wallet"
    | "Convert"
    | "You have"
    | "Total APY"
    | "Amount"
    | "Wallet Balance"
    | "Returns"
    | "Total"
    | "Deposit"
    | "Approve"
    | "Withdraw Fee"
    | "Investment Account"
    | "Please confirm withdraw transaction."
    | "You'll receive an estimate of"
    | "An error has occured. Please try again."
    | "Available"
    | "You'll Receive"
    | "Withdraw"
    | "Recent Transactions"
    | "Account Overview"
    | "Clear all"
    | "Weekly Average APY"
    | "Return"
    | "Available Balance"
    | "Staked Balance"
    | "Staking"
    | "Stake"
    | "Unstake"
    | "Error while withdrawing:"
    | "yAxis Overview"
    | "Price of YAXIS"
    | "Total Value Locked"
    | "Overview"
    | "Your Lifetime Earnings"
    | "Savings Account"
    | "APR"
    | "Vault Overview"
    | "Global Vault Stats"
    | "Vault Account"
    | "Canonical Vaults"
    | "Balance"
    | "Vault Balance"
    | "Auto Stake"
    | 'Auto Staking allows for one click deposit & stake or unstake & withdraw, but requires additional contract approvals to set up.'
    | 'Total Vault value'
    | 'Total YAXIS Staking value'
    | 'Total Liquidity Pool value'
    | 'Get YAXIS'
    | 'YAXIS Supply'
    | 'Interest Earned'
    | 'Your YAXIS rewards'
    | "Vault rewards"
    | "Governance (YAXIS) rewards"
    | "Liquidity Pool token rewards"
    | 'Rewards Earned'
    | 'Liquidity Pools'
    | 'Governance Account'
    | 'YAXIS Staking'
    | 'YAXIS Rewards'
    | 'Logout'
    | 'Account'
    | 'Copy Address'
    | 'Vault'
    | 'Liquidity'
    | 'Connect'
    | 'Help Center'
    | 'Clear Pending'
    | 'Address Copied'
    | 'View on Etherscan'
    | 'Vault'
    | 'Provide Liquidity'
    | 'Governance'
    | 'Logout'
    | 'Claim'
    | 'Claim All'
    | 'Rewards'
    | 'Claim button must have either a vault or rewards type.'
    | 'Security'
    | 'We\'re Hiring'
    | 'Secured by'
    | 'Annual Percentage Rate'
    | 'Compounding Frequency'
    | 'See Your Balance In'
    | 'Future Balance'
    | 'YIP-08 Token Swap is now live! Click here to learn more.'
    | 'YAXIS Price'
    | 'Your strong hands have been rewarded.'
    | 'Vault safe opens and fills with money animation'
    | 'Install'
    | 'Select a wallet provider.'
    | 'Please switch to one of the following Ethereum networks'
    | 'Active Liquidity Pools'
    | 'Legacy Liquidity Pools'
    | "Legacy Liquidity Pools info"
    | 'LPs that are no longer supported'
    | 'Legacy Liquidity Pool'
    | 'Liquidity Pool'
    | 'No longer supported.'
    | 'Please unstake, remove funds, and move to a new LP.'
    | 'Your Position'
    | 'Your Liquidity'
    | 'Remove'
    | 'Add'
    | 'Share of Pool'
    | 'Unstake All'
    | 'REPRESENTING'
    | 'Pool Tokens'
    | 'Total APR'
    | 'YAXIS rewards APR'
    | 'YAXIS rewards APY'
    | 'monthly compound'
    | "Pool Stats"
    | 'Pooled Tokens'
    | "Connect a wallet to start earning rewards."
    | 'To start staking, first approve the Rewards contract to use your LP token'
    | 'Voting Power'
    | 'Community Voting'
    | 'Boost'
    | 'Reward Distribution'
    | 'Snapshot'
    | 'Vote'
    | 'Name'
    | 'Weight'
    | 'Lock up'
    | 'Lock'
    | 'Create Lock'
    | 'These decay over time. Extend the lock up time to get the most benefits.'
    | 'Lock up your YAXIS token to increase your Vault rewards and get voting power toward governance decisions.'
    | '1 week'
    | '1 year'
    | 'It will unlock'
    | 'On'
    | 'Stake your tokens to receive emissions!'
    | 'Step complete.'
    | 'Done.'
    | 'Lock up your YAXIS for extra APY and voting power.'
    | 'rewards'
    | "Gather pending MetaVault rewards"
    | 'First, exit the previous contract'
    | "Approve the new rewards contract to use your MVLT."
    | "Connect a wallet to see if actions are needed."
    | 'Version 3'
    | "All up to date!"
    | 'Exit MetaVault'
    | 'Re-enter Vaults'
    | 'Unstake YAXIS'
    | 'Boost your rewards'
    | 'Welcome to yAxis 3.0'
    | 'What\'s new'
    | 'Migrate over'
    | 'What is a Liquidity Pool?'
    | 'Approve Vault'
    | 'Approve Automatic Staking'
    | 'Approve Gauge'
    // TODO: Might need tweaks
    | 'claim YAXIS'
    // Langauges
    | "English" | "Korean" | "Japanese" | "Chinese" | "Russian" | "Spanish" | "Portuguese"


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
    'yAxis Overview': 'yAxis Overview',
    'Price of YAXIS': 'Price of YAXIS',
    'Total Value Locked': 'Total Value Locked',
    'Overview': 'Overview',
    'Your Lifetime Earnings': 'Your Lifetime Earnings',
    'Savings Account': 'Savings Account',
    'APR': 'APR',
    'Vault Overview': 'Vault Overview',
    'Global Vault Stats': 'Global Vault Stats',
    'Vault Account': 'Vault Account',
    'Canonical Vaults': 'Canonical Vaults',
    'Balance': 'Balance',
    'Vault Balance': 'Vault Balance',
    'Auto Stake': 'Auto Stake',
    'Auto Staking allows for one click deposit & stake or unstake & withdraw, but requires additional contract approvals to set up.': 'Auto Staking allows for one click deposit & stake or unstake & withdraw, but requires additional contract approvals to set up.',
    'Total Vault value': 'Total Vault value',
    'Total YAXIS Staking value': 'Total YAXIS Staking value',
    'Total Liquidity Pool value': 'Total Liquidity Pool value',
    'Get YAXIS': 'Get YAXIS',
    'YAXIS Supply': 'YAXIS Supply',
    'Interest Earned': 'Interest Earned',
    'Your YAXIS rewards': 'Your YAXIS rewards',
    "Vault rewards": "Vault rewards",
    "Governance (YAXIS) rewards": "Governance (YAXIS) rewards",
    "Liquidity Pool token rewards": "Liquidity Pool token rewards",
    'Rewards Earned': 'Rewards Earned',
    'Liquidity Pools': 'Liquidity Pools',
    'Governance Account': 'Governance Account',
    'YAXIS Staking': 'YAXIS Staking',
    'YAXIS Rewards': 'YAXIS Rewards',
    'Connect': 'Connect',
    'Help Center': 'Help Center',
    'Clear Pending': 'Clear Pending',
    'Address Copied': 'Address Copied',
    'View on Etherscan': 'View on Etherscan',
    'Vault': 'Vault',
    'Provide Liquidity': 'Provide Liquidity',
    'Governance': 'Governance',
    'Logout': 'Logout',
    'Copy Address': 'Copy Address',
    'Liquidity': 'Liquidity',
    'Account': 'Account',
    'Claim': 'Claim',
    'Claim All': 'Claim All',
    'Rewards': 'Rewards',
    'Claim button must have either a vault or rewards type.': 'Claim button must have either a vault or rewards type.',
    'claim YAXIS': 'claim YAXIS',
    'Security': 'Security',
    'We\'re Hiring': 'We\'re Hiring',
    'Secured by': 'Secured by',
    'Annual Percentage Rate': 'Annual Percentage Rate',
    'Compounding Frequency': 'Compounding Frequency',
    'See Your Balance In': 'See Your Balance In',
    'Future Balance': 'Future Balance',
    'YIP-08 Token Swap is now live! Click here to learn more.': 'YIP-08 Token Swap is now live! Click here to learn more.',
    'YAXIS Price': 'YAXIS Price',
    'Your strong hands have been rewarded.': 'Your strong hands have been rewarded.',
    'Vault safe opens and fills with money animation': 'Vault safe opens and fills with money animation',
    'Install': 'Install',
    'Select a wallet provider.': 'Select a wallet provider.',
    'Please switch to one of the following Ethereum networks': 'Please switch to one of the following Ethereum networks',
    'Active Liquidity Pools': 'Active Liquidity Pools',
    'Legacy Liquidity Pools': 'Legacy Liquidity Pools',
    "Legacy Liquidity Pools info": "Legacy Liquidity Pools info",
    'LPs that are no longer supported': 'LPs that are no longer supported',
    'Legacy Liquidity Pool': 'Legacy Liquidity Pool',
    'Liquidity Pool': 'Liquidity Pool',
    'No longer supported.': 'No longer supported.',
    'Please unstake, remove funds, and move to a new LP.': 'Please unstake, remove funds, and move to a new LP.',
    'Your Position': 'Your Position',
    'Your Liquidity': 'Your Liquidity',
    'Remove': 'Remove',
    'Add': 'Add',
    'Share of Pool': 'Share of Pool',
    'Unstake All': 'Unstake All',
    'REPRESENTING': 'REPRESENTING',
    'Pool Tokens': 'Pool Tokens',
    'Total APR': 'Total APR',
    'YAXIS rewards APR': 'YAXIS rewards APR',
    'YAXIS rewards APY': 'YAXIS rewards APY',
    'monthly compound': 'monthly compound',
    "Pool Stats": "Pool Stats",
    'Pooled Tokens': 'Pooled Tokens',
    "Connect a wallet to start earning rewards.": "Connect a wallet to start earning rewards.",
    'To start staking, first approve the Rewards contract to use your LP token': 'To start staking, first approve the Rewards contract to use your LP token',
    'Voting Power': 'Voting Power',
    'Community Voting': 'Community Voting',
    'Boost': 'Boost',
    'Reward Distribution': 'Reward Distribution',
    'Snapshot': 'Snapshot',
    'Vote': 'Vote',
    'Name': 'Name',
    'Weight': 'Weight',
    'Lock up': 'Lock up',
    'Lock': 'Lock',
    'Create Lock': 'Create Lock',
    'These decay over time. Extend the lock up time to get the most benefits.': 'These decay over time. Extend the lock up time to get the most benefits.',
    'Lock up your YAXIS token to increase your Vault rewards and get voting power toward governance decisions.': 'Lock up your YAXIS token to increase your Vault rewards and get voting power toward governance decisions.',
    '1 week': '1 week',
    '1 year': '1 year',
    'It will unlock': 'It will unlock',
    'On': 'On',
    'Stake your tokens to receive emissions!': 'Stake your tokens to receive emissions!',
    'Step complete.': 'Step complete.',
    'Done.': 'Done.',
    'Lock up your YAXIS for extra APY and voting power.': 'Lock up your YAXIS for extra APY and voting power.',
    'rewards': 'rewards',
    "Gather pending MetaVault rewards": "Gather pending MetaVault rewards",
    'First, exit the previous contract': 'First, exit the previous contract',
    "Approve the new rewards contract to use your MVLT.": "Approve the new rewards contract to use your MVLT.",
    "Connect a wallet to see if actions are needed.": "Connect a wallet to see if actions are needed.",
    'Version 3': 'Version 3',
    "All up to date!": "All up to date!",
    'Exit MetaVault': 'Exit MetaVault',
    'Re-enter Vaults': 'Re-enter Vaults',
    'Unstake YAXIS': 'Unstake YAXIS',
    'Boost your rewards': 'Boost your rewards',
    'Welcome to yAxis 3.0': 'Welcome to yAxis 3.0',
    'What\'s new': 'What\'s new',
    'Migrate over': 'Migrate over',
    'What is a Liquidity Pool?': 'What is a Liquidity Pool?',
    'Approve Vault': 'Approve Vault',
    'Approve Automatic Staking': 'Approve Automatic Staking',
    'Approve Gauge':
        'Approve Gauge',
    'English': 'English',
    'Korean': 'Korean',
    'Japanese': 'Japanese',
    'Chinese': 'Chinese',
    'Russian': 'Russian',
    'Spanish': 'Spanish',
    'Portuguese': 'Portuguese',
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
    'yAxis Overview': '',
    'Price of YAXIS': '',
    'Total Value Locked': '',
    Overview: '',
    'Your Lifetime Earnings': '',
    'Savings Account': '',
    'APR': '',
    'Vault Overview': '',
    'Global Vault Stats': '',
    'Vault Account': '',
    'Canonical Vaults': '',
    'Balance': '',
    'Vault Balance': '',
    'Auto Stake': '',
    'Auto Staking allows for one click deposit & stake or unstake & withdraw, but requires additional contract approvals to set up.': '',
    'Total Vault value': '',
    'Total YAXIS Staking value': '',
    'Total Liquidity Pool value': '',
    'Get YAXIS': '',
    'YAXIS Supply': '',
    'Interest Earned': '',
    'Your YAXIS rewards': '',
    "Vault rewards": "",
    "Governance (YAXIS) rewards": "",
    "Liquidity Pool token rewards": "",
    'Rewards Earned': '',
    'Liquidity Pools': '',
    'Governance Account': '',
    'YAXIS Staking': '',
    'YAXIS Rewards': '',
    'Connect': '',
    'Help Center': '',
    'Clear Pending': '',
    'Address Copied': '',
    'View on Etherscan': '',
    'Vault': '',
    'Provide Liquidity': '',
    'Governance': '',
    'Logout': '',
    'Copy Address': '',
    'Liquidity': '',
    'Account': '',
    'Rewards': '',
    'Claim': '',
    'Claim All': '',
    'Claim button must have either a vault or rewards type.': '',
    'claim YAXIS': '',
    'Security': '',
    'We\'re Hiring': '',
    'Secured by': '',
    'Annual Percentage Rate': '',
    'Compounding Frequency': '',
    'See Your Balance In': '',
    'Future Balance': '',
    'YIP-08 Token Swap is now live! Click here to learn more.': '',
    'YAXIS Price': '',
    'Your strong hands have been rewarded.': '',
    'Vault safe opens and fills with money animation': '',
    'Install': '',
    'Select a wallet provider.': '',
    'Please switch to one of the following Ethereum networks': '',
    'Active Liquidity Pools': '',
    'Legacy Liquidity Pools': '',
    "Legacy Liquidity Pools info": '',
    'LPs that are no longer supported': '',
    'Legacy Liquidity Pool': '',
    'Liquidity Pool': '',
    'No longer supported.': '',
    'Please unstake, remove funds, and move to a new LP.': '',
    'Your Position': '',
    'Your Liquidity': '',
    'Remove': '',
    'Add': '',
    'Share of Pool': '',
    'Unstake All': '',
    'REPRESENTING': '',
    'Pool Tokens': '',
    'Total APR': '',
    'YAXIS rewards APR': '',
    'YAXIS rewards APY': '',
    'monthly compound': '',
    "Pool Stats": '',
    'Pooled Tokens': '',
    "Connect a wallet to start earning rewards.": '',
    'To start staking, first approve the Rewards contract to use your LP token': '',
    'Voting Power': '',
    'Community Voting': '',
    'Boost': '',
    'Reward Distribution': '',
    'Snapshot': '',
    'Vote': '',
    'Name': '',
    'Weight': '',
    'Lock up': '',
    'Lock': '',
    'Create Lock': '',
    'These decay over time. Extend the lock up time to get the most benefits.': '',
    'Lock up your YAXIS token to increase your Vault rewards and get voting power toward governance decisions.': '',
    '1 week': '',
    '1 year': '',
    'It will unlock': '',
    'On': '',
    'Stake your tokens to receive emissions!': '',
    'Step complete.': '',
    'Done.': '',
    'Lock up your YAXIS for extra APY and voting power.': '',
    'rewards': '',
    "Gather pending MetaVault rewards": '',
    'First, exit the previous contract': '',
    "Approve the new rewards contract to use your MVLT.": '',
    "Connect a wallet to see if actions are needed.": '',
    'Version 3': '',
    "All up to date!": '',
    'Exit MetaVault': '',
    'Re-enter Vaults': '',
    'Unstake YAXIS': '',
    'Boost your rewards': '',
    'Welcome to yAxis 3.0': '',
    'What\'s new': '',
    'Migrate over': '',
    'What is a Liquidity Pool?': '',
    'Approve Vault': '',
    'Approve Automatic Staking': '',
    'Approve Gauge':
        '',
    'English': '',
    'Korean': '',
    'Japanese': '',
    'Chinese': '',
    'Russian': '',
    'Spanish': '',
    'Portuguese': '',
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
    'yAxis Overview': '',
    'Price of YAXIS': '',
    'Total Value Locked': '',
    Overview: '',
    'Your Lifetime Earnings': '',
    'Savings Account': '',
    'APR': '',
    'Vault Overview': '',
    'Global Vault Stats': '',
    'Vault Account': '',
    'Canonical Vaults': '',
    'Balance': '',
    'Vault Balance': '',
    'Auto Stake': '',
    'Auto Staking allows for one click deposit & stake or unstake & withdraw, but requires additional contract approvals to set up.': '',
    'Total Vault value': '',
    'Total YAXIS Staking value': '',
    'Total Liquidity Pool value': '',
    'Get YAXIS': '',
    'YAXIS Supply': '',
    'Interest Earned': '',
    'Your YAXIS rewards': '',
    "Vault rewards": "",
    "Governance (YAXIS) rewards": "",
    "Liquidity Pool token rewards": "",
    'Rewards Earned': '',
    'Liquidity Pools': '',
    'Governance Account': '',
    'YAXIS Staking': '',
    'YAXIS Rewards': '',
    'Connect': '',
    'Help Center': '',
    'Clear Pending': '',
    'Address Copied': '',
    'View on Etherscan': '',
    'Vault': '',
    'Provide Liquidity': '',
    'Governance': '',
    'Logout': '',
    'Copy Address': '',
    'Liquidity': '',
    'Account': '',
    'Rewards': '',
    'Claim': '',
    'Claim All': '',
    'Claim button must have either a vault or rewards type.': '',
    'claim YAXIS': '',
    'Security': '',
    'We\'re Hiring': '',
    'Secured by': '',
    'Annual Percentage Rate': '',
    'Compounding Frequency': '',
    'See Your Balance In': '',
    'Future Balance': '',
    'YIP-08 Token Swap is now live! Click here to learn more.': '',
    'YAXIS Price': '',
    'Your strong hands have been rewarded.': '',
    'Vault safe opens and fills with money animation': '',
    'Install': '',
    'Select a wallet provider.': '',
    'Please switch to one of the following Ethereum networks': '',
    'Active Liquidity Pools': '',
    'Legacy Liquidity Pools': '',
    "Legacy Liquidity Pools info": '',
    'LPs that are no longer supported': '',
    'Legacy Liquidity Pool': '',
    'Liquidity Pool': '',
    'No longer supported.': '',
    'Please unstake, remove funds, and move to a new LP.': '',
    'Your Position': '',
    'Your Liquidity': '',
    'Remove': '',
    'Add': '',
    'Share of Pool': '',
    'Unstake All': '',
    'REPRESENTING': '',
    'Pool Tokens': '',
    'Total APR': '',
    'YAXIS rewards APR': '',
    'YAXIS rewards APY': '',
    'monthly compound': '',
    "Pool Stats": '',
    'Pooled Tokens': '',
    "Connect a wallet to start earning rewards.": '',
    'To start staking, first approve the Rewards contract to use your LP token': '',
    'Voting Power': '',
    'Community Voting': '',
    'Boost': '',
    'Reward Distribution': '',
    'Snapshot': '',
    'Vote': '',
    'Name': '',
    'Weight': '',
    'Lock up': '',
    'Lock': '',
    'Create Lock': '',
    'These decay over time. Extend the lock up time to get the most benefits.': '',
    'Lock up your YAXIS token to increase your Vault rewards and get voting power toward governance decisions.': '',
    '1 week': '',
    '1 year': '',
    'It will unlock': '',
    'On': '',
    'Stake your tokens to receive emissions!': '',
    'Step complete.': '',
    'Done.': '',
    'Lock up your YAXIS for extra APY and voting power.': '',
    'rewards': '',
    "Gather pending MetaVault rewards": '',
    'First, exit the previous contract': '',
    "Approve the new rewards contract to use your MVLT.": '',
    "Connect a wallet to see if actions are needed.": '',
    'Version 3': '',
    "All up to date!": '',
    'Exit MetaVault': '',
    'Re-enter Vaults': '',
    'Unstake YAXIS': '',
    'Boost your rewards': '',
    'Welcome to yAxis 3.0': '',
    'What\'s new': '',
    'Migrate over': '',
    'What is a Liquidity Pool?': '',
    'Approve Vault': '',
    'Approve Automatic Staking': '',
    'Approve Gauge':
        '',
    'English': '',
    'Korean': '',
    'Japanese': '',
    'Chinese': '',
    'Russian': '',
    'Spanish': '',
    'Portuguese': '',
}

const RU: Translations = {
    Asset: 'Актив',
    From: 'Из',
    'To Wallet': '«В кошелек»',
    Convert: 'Перерабатывать',
    'You have': 'У вас есть',
    'Total APY': '«итого APY»',
    Amount: 'Количество',
    'Wallet Balance': "Баланс кошелька",
    Returns: 'Возврат',
    Total: 'итого',
    Deposit: 'Депозит',
    Approve: 'Утвердить',
    'Withdraw Fee': '«Комиссия за вывод»',
    'Investment Account': '«Инвестиционный счет»',
    'Please confirm withdraw transaction.': 'Подтвердите транзакцию вывода.',
    "You'll receive an estimate of": '«Вы получите ориентировочно»',
    'An error has occured. Please try again.': 'Произошла ошибка.  Пожалуйста, попробуйте еще раз.',
    'Error while withdrawing:': 'Ошибка при выводе:',
    Available: 'Доступнo',
    "You'll Receive": '«Вы получите»',
    Withdraw: 'Снять со счета',
    'Recent Transactions': '«Последние транзакции»',
    'Account Overview': '«Обзор учетной записи»',
    'Clear all': 'Очистить все',
    'Weekly Average APY': '«Среднее значение APY за неделю»',
    Return: 'Bозврат',
    'Available Balance': 'Доступные средства',
    'Staked Balance': '«Ставка баланса»',
    Staking: 'Ставка',
    Stake: 'Ставка',
    Unstake: 'Oтменить ставк',
    'yAxis Overview': 'Обзор yAxis',
    'Price of YAXIS': 'Цена YAXIS',
    'Total Value Locked': 'Общая стоимость заблокирована',
    Overview: 'Обзор',
    'Your Lifetime Earnings': 'Ваш пожизненный заработок',
    'Savings Account': 'Сберегательный счет',
    'APR': 'APR',
    'Vault Overview': 'Обзор сейфa',
    'Global Vault Stats': 'глобальная статистика сейфов',
    'Vault Account': 'счет в сейфе',
    'Canonical Vaults': 'Канонические сейфы',
    'Balance': 'Баланс',
    'Vault Balance': 'Баланс сейфa',
    'Auto Stake': 'Автоматическая ставка',
    'Auto Staking allows for one click deposit & stake or unstake & withdraw, but requires additional contract approvals to set up.': '«Автоматическая ставка позволяет вносить депозит и сделать ставку, или отменить и снять ставку одним щелчком мыши, но для настройки требуется дополнительное согласование контрактов.',
    'Total Vault value': '',
    'Total YAXIS Staking value': '',
    'Total Liquidity Pool value': '',
    'Get YAXIS': '',
    'YAXIS Supply': '',
    'Interest Earned': '',
    'Your YAXIS rewards': '',
    "Vault rewards": "",
    "Governance (YAXIS) rewards": "",
    "Liquidity Pool token rewards": "",
    'Liquidity Pools': '',
    'Rewards Earned': '',
    'Governance Account': '',
    'YAXIS Staking': '',
    'YAXIS Rewards': '',
    'Connect': '',
    'Help Center': '',
    'Clear Pending': '',
    'Address Copied': '',
    'View on Etherscan': '',
    'Vault': '',
    'Provide Liquidity': '',
    'Governance': '',
    'Logout': '',
    'Copy Address': '',
    'Liquidity': '',
    'Account': '',
    'Rewards': '',
    'Claim': '',
    'Claim All': '',
    'Claim button must have either a vault or rewards type.': '',
    'claim YAXIS': '',
    'Security': '',
    'We\'re Hiring': '',
    'Secured by': '',
    'Annual Percentage Rate': '',
    'Compounding Frequency': '',
    'See Your Balance In': '',
    'Future Balance': '',
    'YIP-08 Token Swap is now live! Click here to learn more.': '',
    'YAXIS Price': '',
    'Your strong hands have been rewarded.': '',
    'Vault safe opens and fills with money animation': '',
    'Install': '',
    'Select a wallet provider.': '',
    'Please switch to one of the following Ethereum networks': '',
    'Active Liquidity Pools': '',
    'Legacy Liquidity Pools': '',
    "Legacy Liquidity Pools info": '',
    'LPs that are no longer supported': '',
    'Legacy Liquidity Pool': '',
    'Liquidity Pool': '',
    'No longer supported.': '',
    'Please unstake, remove funds, and move to a new LP.': '',
    'Your Position': '',
    'Your Liquidity': '',
    'Remove': '',
    'Add': '',
    'Share of Pool': '',
    'Unstake All': '',
    'REPRESENTING': '',
    'Pool Tokens': '',
    'Total APR': '',
    'YAXIS rewards APR': '',
    'YAXIS rewards APY': '',
    'monthly compound': '',
    "Pool Stats": '',
    'Pooled Tokens': '',
    "Connect a wallet to start earning rewards.": '',
    'To start staking, first approve the Rewards contract to use your LP token': '',
    'Voting Power': '',
    'Community Voting': '',
    'Boost': '',
    'Reward Distribution': '',
    'Snapshot': '',
    'Vote': '',
    'Name': '',
    'Weight': '',
    'Lock up': '',
    'Lock': '',
    'Create Lock': '',
    'These decay over time. Extend the lock up time to get the most benefits.': '',
    'Lock up your YAXIS token to increase your Vault rewards and get voting power toward governance decisions.': '',
    '1 week': '',
    '1 year': '',
    'It will unlock': '',
    'On': '',
    'Stake your tokens to receive emissions!': '',
    'Step complete.': '',
    'Done.': '',
    'Lock up your YAXIS for extra APY and voting power.': '',
    'rewards': '',
    "Gather pending MetaVault rewards": '',
    'First, exit the previous contract': '',
    "Approve the new rewards contract to use your MVLT.": '',
    "Connect a wallet to see if actions are needed.": '',
    'Version 3': '',
    "All up to date!": '',
    'Exit MetaVault': '',
    'Re-enter Vaults': '',
    'Unstake YAXIS': '',
    'Boost your rewards': '',
    'Welcome to yAxis 3.0': '',
    'What\'s new': '',
    'Migrate over': '',
    'What is a Liquidity Pool?': '',
    'Approve Vault': '',
    'Approve Automatic Staking': '',
    'Approve Gauge':
        '',
    'English': 'Английский',
    'Korean': 'Корейский',
    'Japanese': 'Японский',
    'Chinese': 'Китайский',
    'Russian': 'Русский',
    'Spanish': '',
    'Portuguese': '',
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
    'yAxis Overview': '',
    'Price of YAXIS': '',
    'Total Value Locked': '',
    Overview: '',
    'Your Lifetime Earnings': '',
    'Savings Account': '',
    'APR': '',
    'Vault Overview': '',
    'Global Vault Stats': '',
    'Vault Account': '',
    'Canonical Vaults': '',
    'Balance': '',
    'Vault Balance': '',
    'Auto Stake': '',
    'Auto Staking allows for one click deposit & stake or unstake & withdraw, but requires additional contract approvals to set up.': '',
    'Total Vault value': '',
    'Total YAXIS Staking value': '',
    'Total Liquidity Pool value': '',
    'Get YAXIS': '',
    'YAXIS Supply': '',
    'Interest Earned': '',
    'Your YAXIS rewards': '',
    "Vault rewards": "",
    "Governance (YAXIS) rewards": "",
    "Liquidity Pool token rewards": "",
    'Rewards Earned': '',
    'Liquidity Pools': '',
    'Governance Account': '',
    'YAXIS Staking': '',
    'YAXIS Rewards': '',
    'Connect': '',
    'Help Center': '',
    'Clear Pending': '',
    'Address Copied': '',
    'View on Etherscan': '',
    'Vault': '',
    'Provide Liquidity': '',
    'Governance': '',
    'Logout': '',
    'Copy Address': '',
    'Liquidity': '',
    'Account': '',
    'Rewards': '',
    'Claim': '',
    'Claim All': '',
    'Claim button must have either a vault or rewards type.': '',
    'claim YAXIS': '',
    'Security': '',
    'We\'re Hiring': '',
    'Secured by': '',
    'Annual Percentage Rate': '',
    'Compounding Frequency': '',
    'See Your Balance In': '',
    'Future Balance': '',
    'YIP-08 Token Swap is now live! Click here to learn more.': '',
    'YAXIS Price': '',
    'Your strong hands have been rewarded.': '',
    'Vault safe opens and fills with money animation': '',
    'Install': '',
    'Select a wallet provider.': '',
    'Please switch to one of the following Ethereum networks': '',
    'Active Liquidity Pools': '',
    'Legacy Liquidity Pools': '',
    "Legacy Liquidity Pools info": '',
    'LPs that are no longer supported': '',
    'Legacy Liquidity Pool': '',
    'Liquidity Pool': '',
    'No longer supported.': '',
    'Please unstake, remove funds, and move to a new LP.': '',
    'Your Position': '',
    'Your Liquidity': '',
    'Remove': '',
    'Add': '',
    'Share of Pool': '',
    'Unstake All': '',
    'REPRESENTING': '',
    'Pool Tokens': '',
    'Total APR': '',
    'YAXIS rewards APR': '',
    'YAXIS rewards APY': '',
    'monthly compound': '',
    "Pool Stats": '',
    'Pooled Tokens': '',
    "Connect a wallet to start earning rewards.": '',
    'To start staking, first approve the Rewards contract to use your LP token': '',
    'Voting Power': '',
    'Community Voting': '',
    'Boost': '',
    'Reward Distribution': '',
    'Snapshot': '',
    'Vote': '',
    'Name': '',
    'Weight': '',
    'Lock up': '',
    'Lock': '',
    'Create Lock': '',
    'These decay over time. Extend the lock up time to get the most benefits.': '',
    'Lock up your YAXIS token to increase your Vault rewards and get voting power toward governance decisions.': '',
    '1 week': '',
    '1 year': '',
    'It will unlock': '',
    'On': '',
    'Stake your tokens to receive emissions!': '',
    'Step complete.': '',
    'Done.': '',
    'Lock up your YAXIS for extra APY and voting power.': '',
    'rewards': '',
    "Gather pending MetaVault rewards": '',
    'First, exit the previous contract': '',
    "Approve the new rewards contract to use your MVLT.": '',
    "Connect a wallet to see if actions are needed.": '',
    'Version 3': '',
    "All up to date!": '',
    'Exit MetaVault': '',
    'Re-enter Vaults': '',
    'Unstake YAXIS': '',
    'Boost your rewards': '',
    'Welcome to yAxis 3.0': '',
    'What\'s new': '',
    'Migrate over': '',
    'What is a Liquidity Pool?': '',
    'Approve Vault': '',
    'Approve Automatic Staking': '',
    'Approve Gauge': '',
    'English': '',
    'Korean': '',
    'Japanese': '',
    'Chinese': '',
    'Russian': '',
    'Spanish': '',
    'Portuguese': '',
}

const dictionary: Dictionary = {
    EN,
    KO,
    JA,
    ZH,
    RU,
}

export default dictionary
