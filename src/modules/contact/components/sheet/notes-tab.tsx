import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui-react'

const MOCK_NOTES = [
	{
		id: '1',
		content:
			'Cliente demonstrou interesse em expandir o contrato para a filial de São Paulo. Agendar reunião com o diretor financeiro.',
		date: 'Há 2 dias',
		author: {
			name: 'Dra. Ana Silva',
			avatar: 'https://i.pravatar.cc/150?u=ana',
		},
	},
	{
		id: '2',
		content:
			'Documentação inicial recebida. Faltam apenas os comprovantes de residência dos sócios.',
		date: '15 Dez 2024',
		author: {
			name: 'Secretária Júlia',
		},
	},
	{
		id: '3',
		content:
			'Reunião inicial muito produtiva. O cliente tem perfil conservador e prefere comunicação via email.',
		date: '10 Dez 2024',
		author: {
			name: 'Dr. Carlos Mendes',
		},
	},
]

export function NotesTab() {
	return (
		<div className="space-y-6 pt-4">
			{MOCK_NOTES.map((note) => (
				<div className="flex gap-4" key={note.id}>
					<Avatar className="mt-1 h-8 w-8">
						<AvatarImage src={note.author.avatar} />
						<AvatarFallback>{note.author.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="flex flex-1 flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm">
						<div className="flex items-center justify-between">
							<span className="font-medium text-sm">{note.author.name}</span>
							<span className="text-muted-foreground text-xs">{note.date}</span>
						</div>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{note.content}
						</p>
					</div>
				</div>
			))}
		</div>
	)
}
