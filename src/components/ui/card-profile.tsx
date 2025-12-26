import { Avatar, AvatarFallback, AvatarImage, Text } from '@tc96/ui-react'
import { Card, CardContent } from './card'

type CardProfileProps = {
	name: string
	avatar?: string
	resume?: string
}

export function CardProfile({ name, avatar, resume }: CardProfileProps) {
	return (
		<Card>
			<CardContent>
				<Avatar>
					<AvatarImage alt={`Image profile ${name}`} src={avatar} />
					<AvatarFallback className="text-2xl">{name}</AvatarFallback>
				</Avatar>

				<div className="flex flex-col items-center gap-1">
					<Text>{name}</Text>
					{resume ?? <Text>{resume}</Text>}
				</div>
			</CardContent>
		</Card>
	)
}
