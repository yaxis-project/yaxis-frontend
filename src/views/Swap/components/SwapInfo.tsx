import { useState } from 'react'
import { Row, Col, Collapse, Typography } from 'antd'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import styled from 'styled-components'
const { Panel } = Collapse
const { Title } = Typography

const StyledCollapse = styled(Collapse)<any>`
	${(props) =>
		props.active
			? `
			border: 1px solid ${props.theme.color.primary.main};
	.ant-collapse-item {
		color: white;
		background: ${props.theme.color.primary.main};
		transition: background 0.5s;
	}
	.ant-collapse-header.ant-collapse-header {
		color: white;
	}
	`
			: ``}
`

export default function SwapInfo() {
	const [active, setActive] = useState(['0'])
	return (
		<DetailOverviewCard title={'Details'}>
			<BodyMain>
				<Paragraph>
					Starting April 17th 2021, the governance token YAX is
					migrating to YAXIS.
					<br /> <br /> The{' '}
					<TextLink
						target={'_blank'}
						rel="noopener noreferrer"
						href="https://gov.yaxis.io/#/yaxis/proposal/QmRCQFAS58fzbVZR4RSzQZv5JMsnmqGbYk9qN4CVhrUqWb"
					>
						YIP-08
					</TextLink>{' '}
					governance proposal passed with an overwhelming 97.18%
					approval rating! <br /> <br /> It will be distributed fairly
					through at least 1 year of emissions. The token will have a
					maximum supply of 11 million YAXIS tokens - with 1 million
					of those coming from the token swap. The full proposal is
					detailed{' '}
					<TextLink
						target={'_blank'}
						rel="noopener noreferrer"
						href="https://docs.google.com/document/d/1CpLUUjH6PBKQxh4_NGKZdJH8smktdfgGgZX_HkMijMw/edit"
					>
						here
					</TextLink>
					.
				</Paragraph>
				<Row style={{ padding: '10px' }}>
					<Col span={20} push={2}>
						<Title level={5}>Frequently Asked Questions</Title>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('0') ? ['0'] : [])
							}
							active={active.includes('0')}
						>
							<Panel header={'What do I need to do?'} key="0">
								<Body>
									The first step is to claim any unclaimed
									rewards that are pending on MetaVault or a
									LP.
									<br />
									<br />
									Next click the SWAP button!
									<br />
									<br />
									No need to unstake your staked YAX. This
									all-in-one action will swap your account
									balance and swap your staking balance.
									<br />
									<br />
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('1') ? ['1'] : [])
							}
							active={active.includes('1')}
						>
							<Panel
								header={'What about the Liqudity Pools?'}
								key="1"
							>
								<Body>
									These will unfortunately take more work to
									swap over. You will have to go through the
									following steps:
									<br />
									<ol>
										<li>
											Unstake the LP tokens from yAxis
										</li>
										<li>Withdraw your funds from the LP</li>
										<li>
											Add your funds to the new
											corresponding YAXIS LP
										</li>
									</ol>
									The extra rewards will be well worth it!
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('3') ? ['3'] : [])
							}
							active={active.includes('3')}
						>
							<Panel header={'What are the benefits?'} key="3">
								<Body>
									There are 3 main outcomes from this token
									swap:
									<ul>
										<li>
											Upgrade our token from an ERC20
											token to an ERC677 token.
										</li>
										<li>
											Boost APY of the pools and vaults.
										</li>
										<li>
											Attract high TVL, and generate large
											revenue for holders.
										</li>
									</ul>
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('2') ? ['2'] : [])
							}
							active={active.includes('2')}
						>
							<Panel header={'What’s an ERC677 token?'} key="2">
								<Body>
									The other advantage of having a token swap,
									is it allows us to upgrade to{' '}
									<TextLink
										target={'_blank'}
										rel="noopener noreferrer"
										href="https://github.com/ethereum/EIPs/issues/677"
									>
										ERC677
									</TextLink>
									. It shares the same properties of an ERC20
									token only with added features. <br />
									<br />
									The main one being: you can “transfer and
									call” in one transaction. That means you
									don’t need to first approve staking in a
									separate transaction, before actually
									staking. You can both approve and send
									tokens in the same transaction. This
									function will lower fees for entering the
									ecosystem, and is a key competitive
									advantage over other platforms. It has no
									issues with trading, wallets etc.
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('4') ? ['4'] : [])
							}
							active={active.includes('4')}
						>
							<Panel
								header={'How will the tokens be distributed?'}
								key="4"
							>
								<Body>
									The{' '}
									<TextLink
										target={'_blank'}
										rel="noopener noreferrer"
										href="https://gov.yaxis.io/#/yaxis/proposal/QmaroDcokRWpmWjfNrjoywAmyeBkJqxqjn55VPYkh4joEw"
									>
										YIP-09
									</TextLink>{' '}
									governance proposal established the
									following fair mining allocations:
									<br />
									<br />
									<ul>
										<b>Growth:</b>
										<li>
											4 million (36.4%) tokens to the
											community (staking + LP).
										</li>
										<li>
											4 million (36.4%) tokens to vault
											users.
										</li>
										<li>
											800k (7.3%) tokens flexibly to
											maintain balance.
										</li>
										<br />
										<b>Treasuries:</b>
										<li>
											500k (4.5%) tokens to support the
											Champions Bounty Programme who will
											help with marketing, partnerships,
											initiatives, exchanges, and content.
										</li>
										<li>
											400k (3.6%) tokens towards a
											development fund for building.
										</li>
										<li>300k (2.7%) tokens to the team.</li>
									</ul>
									For more details see the full proposal{' '}
									<TextLink
										target={'_blank'}
										rel="noopener noreferrer"
										href="https://docs.google.com/document/d/1jikTxfk7qqgiXvd_RMQzTQwKG9xVbF3PMBK9-nIRtMU"
									>
										here
									</TextLink>
									.
								</Body>
							</Panel>
						</StyledCollapse>
					</Col>
				</Row>
			</BodyMain>
		</DetailOverviewCard>
	)
}

const Paragraph = styled(Typography.Paragraph)`
	font-size: 16px;
`

const BodyMain = styled.div`
	margin: 5%;
`

const Body = styled(Paragraph)`
	margin: 5% 10%;
`

const TextLink = styled.a`
	color: ${(props) => props.theme.color.primary.main};
`
