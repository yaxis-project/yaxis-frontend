import React from 'react'
import Card from '../../components/Card'
import './index.less'

const gridStyle = {
	width: '100%',
}

interface DetailOverviewCardRowProps {
	children: React.ReactNode
	inline?: React.ReactNode
}

/**
 * Generates a generic row for a card styled component.
 * @param props DetailOverviewCardProps
 * @see DetailOverviewCard
 */
export const DetailOverviewCardRow: React.FC<DetailOverviewCardRowProps> = ({
	children,
	inline,
}) => (
	<div
		className="card-row detail-overview-card-row"
		style={gridStyle}
		data-inline={!!inline}
	>
		{children}
	</div>
)

interface DetailOverviewCardProps {
	children: React.ReactNode
	title: React.ReactNode
}

/**
 * Generates a generic card styled component.
 * @param props DetailOverviewCardProps
 * @see DetailOverviewCardRow
 */
export const DetailOverviewCard: React.FC<DetailOverviewCardProps> = ({
	children,
	title,
}) => (
	<Card
		className="detail-overview-card"
		style={{ padding: 0 }}
		title={
			<span
				style={{
					fontSize: '19px',
				}}
			>
				{title}
			</span>
		}
	>
		{children}
	</Card>
)
