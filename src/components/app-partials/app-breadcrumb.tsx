'use client'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { allRoutes } from '@/shared/config/routes'
import { toSlug } from '@/shared/utils/to-slug'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

type BreadcrumbRoute = {
	label: string
	link: string | null
}

const SEGMENT_LABELS: Record<string, string> = {
	new: 'Novo',
	edit: 'Editar',
	create: 'Criar',
	view: 'Visualizar',
	settings: 'Configurações',
}

const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isUUID(segment: string): boolean {
	return UUID_REGEX.test(segment)
}

function getSegmentLabel(segment: string): string {
	if (isUUID(segment)) {
		return 'Detalhes'
	}

	if (SEGMENT_LABELS[segment.toLowerCase()]) {
		return SEGMENT_LABELS[segment.toLowerCase()]
	}

	return segment.charAt(0).toUpperCase() + segment.slice(1)
}

type AppBreadcrumbProps = {
	routes: BreadcrumbRoute[]
}

function buildItemsFromSegments(pathname: string) {
	const segments = pathname.split('/').filter(Boolean)
	const items: BreadcrumbRoute[] = []

	segments.forEach((segment, index) => {
		const CURRENT_INDEX = index + 1
		const currentPath = `/${segments.slice(0, CURRENT_INDEX).join('/')}`
		const isLastSegment = segments.length === CURRENT_INDEX

		const matchedRoute = allRoutes.find((route) => route.link === currentPath)

		if (matchedRoute) {
			items.push({
				label: matchedRoute.label,
				link: !isLastSegment ? matchedRoute.link : null,
			})
		} else {
			const isUuid = isUUID(segment)
			const isSpecialSegment = Object.keys(SEGMENT_LABELS).includes(
				segment.toLowerCase(),
			)

			if (!isUuid) {
				if (isSpecialSegment || isLastSegment) {
					items.push({
						label: getSegmentLabel(segment),
						link: !isLastSegment ? currentPath : null,
					})
				}
			}
		}
	})

	return items
}

export function AppBreadcrumb({ routes }: AppBreadcrumbProps) {
	const pathname = usePathname()

	const itemsFromSegments = useMemo(() => {
		return buildItemsFromSegments(pathname)
	}, [pathname])

	const items = routes ?? itemsFromSegments

	if (items.length === 0) {
		return null
	}

	return (
		<Breadcrumb className="px-2">
			<BreadcrumbList>
				{items.map((item, index) => {
					const isLastItem = index === items.length - 1

					return isLastItem ? (
						<BreadcrumbItem key={toSlug(item.label)}>
							<BreadcrumbPage className="flex items-center gap-2">
								{item.label}
							</BreadcrumbPage>
						</BreadcrumbItem>
					) : (
						<div className="flex items-center gap-2" key={toSlug(item.label)}>
							<BreadcrumbItem>
								<BreadcrumbLink
									className="flex items-center gap-2 transition-colors hover:text-foreground"
									href={item.link || '#'}
								>
									{item.label}
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator> / </BreadcrumbSeparator>
						</div>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
