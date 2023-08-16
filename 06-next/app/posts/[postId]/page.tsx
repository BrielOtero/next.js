import { getPostData, getSortedPostsData } from '@/lib/posts'
import React from 'react'
import { notFound } from 'next/navigation'
import getFormattedDate from '@/lib/getFormattedDate'
import Link from 'next/link'
import { FaHome } from "react-icons/fa"

export function generateStaticParams() {
	const posts = getSortedPostsData()

	return posts.map((post) => ({
		postId: post.id,
	}))
}

export function generateMetadata({ params }: { params: { postId: string } }) {
	const posts = getSortedPostsData()
	const { postId } = params

	const post = posts.find(post => post.id === postId)

	if (!post) {
		return {
			title: 'Post Not Found'
		}
	}
	return {
		title: post.title,
	}
}

export default async function Post({ params }: { params: { postId: string } }) {
	const posts = getSortedPostsData()
	const { postId } = params

	if (!posts.find(post => post.id === postId)) notFound()

	const { title, date, contentHtml } = await getPostData(postId)

	const pubDate = getFormattedDate(date)

	return (
		<main className="px-6 prose prose-xl prose-slate dark:prose-invert mx-auto">
			<h1 className="text-3xl mt-4 mb-0">{title}</h1>
			<p className="mt-0">
				{pubDate}
			</p>
			<article>
				<section dangerouslySetInnerHTML={{ __html: contentHtml }} />
				<p>
					<Link href="/" className='fixed z-90 bottom-10 right-8 bg-slate-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-slate-700 hover:drop-shadow-2xl hover:animate-pulse duration-1000'>
						<FaHome />
					</Link>
				</p>
			</article>
		</main>
	)
}
