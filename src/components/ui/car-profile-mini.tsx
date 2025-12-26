import { Avatar, AvatarFallback, AvatarImage, Text } from '@tc96/ui-react'
import { Card, CardContent } from './card'

type CardProfileMiniProps = {
	name: string
	avatar?: string
}

export function CardProfileMini({ name, avatar }: CardProfileMiniProps) {
	return (
		<div className="flex items-center gap-2">
			<Avatar size="sm">
				<AvatarImage alt={`Image profile ${name}`} src={avatar} />
				<AvatarFallback className="text-2xl">{name}</AvatarFallback>
			</Avatar>

			<Text className="max-w-[260px] truncate" size="sm">
				{name}
			</Text>
		</div>
	)
}
