import { Icons } from '@/components/shared/icons'

export default function Loading() {
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<Icons.loading className='h-11 w-11' />
		</div>
	)
}
