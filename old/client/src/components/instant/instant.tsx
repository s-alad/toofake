import React, { useState } from 'react';
import './instant.css';
import trash from '../../static/trash.png';

type Instant = {
	avatar: string,
	username: string,
	late: string,
	icon: string,
	primary: string,
	secondary: string,
	location: string
	caption: string,
	reactions: Array<any>,
	comments: any,
	postid: string,
}

function Instant({ username, location, late, caption, primary, secondary, avatar, reactions, comments, postid }: Instant) {

	const [deletepost, setDelete] = useState(false);

	const [comment, setComment] = useState('');

	const [expanded, setExpanded] = useState(false);
	function expand() {
		setExpanded(!expanded);
	}
	function minimize() {
		setExpanded(false);
	}

	function logComments(data: any) {
		console.log('comments!', comments)
		return ''
	}
	function addComment() {
		console.log('add comment')

		if (comment == '') {
			return
		}


		let token = localStorage.getItem('idtoken') ?? ''
		fetch(`comment/${postid}/${comment}/${token}`).then(
			(value) => {
				console.log(value)
				return value.json()
			}
		).then(
			(data) => {
				console.log(data)
			}
		)
		setComment('')
		setTimeout(() => {
			window.location.replace('/');
		}, 1000);
		document.querySelector('input')!.defaultValue = '';
		//reload comments
	}

	const [main, setMain] = useState(true)

	return (
		<>
		{deletepost ?
			<div className='instant'>
				<div>
					are you sure you want to delete this post?
					<div className='del-select'>
						<div>yes</div>
						<div>no</div>
					</div>
				</div>
			</div>
			:
			<div className='instant'>
				<div className='details'>
					<div className='icon'>
						<div className='avatar'>
							<img src={avatar}></img>
						</div>
					</div>
					<div className='information'>
						<div className='username'>
							{username}
						</div>
						<div className='location'>
							{location} · {late}
						</div>
					</div>
					<div className='extra'>
						{username === localStorage.getItem('username') ? <img onClick={() => setDelete(true)} className='trash' src={trash} /> : ''}
					</div>
				</div>
				<div className='event'>
					<div className='front'>
						{main ? <img src={primary} /> : <img src={secondary} />}
						<div className='back' onClick={() => { setMain(!main) }}>
							{main ? <img src={secondary} /> : <img src={primary} />}
						</div>
						<div className='reactions'>
							{reactions.map(function (data, idx) {
								return <div className='reaction' key={idx}>
									<img src={data.link} />
									<div className='emoji'> {data.emoji} </div>
								</div>
							})}
						</div>
					</div>

				</div>
				<div className='caption'>
					{caption}
				</div>
				{
					comments.length != 0 ?
						<div className='comment-control'>
							<div className='seperator'></div>
							{
								expanded ?
									<div className='toggle' onClick={() => minimize()}> minimize comments ⮥</div>
									:
									<div className='toggle' onClick={() => expand()}>expand comments ↴</div>}
						</div>
						: <div className='placeholder'></div>
				}
				{
					comments.length != 0 && expanded == true ?
						<div className='comments'>
							{comments.map(function (data: any, idx: any) {
								logComments(data)
								return <div className='comment' key={idx}>
									<div className='avatar'>
										<img src={
											(data.user.profilePicture != undefined && data.user.profilePicture != null)
												? data.user.profilePicture.url : ''}>
										</img>
									</div>
									<div className='username'> {data.userName} </div>
									<div className='text'> {data.text} </div>
								</div>
							})
							}
						</div>
						:
						<div></div>
				}
				<div className='add'>
					<textarea rows={2} onChange={(txt) => setComment(txt.target.value)}></textarea>
					<div className='button' onClick={() => addComment()}>comment</div>
				</div>
			</div>
		}</>
	);
}

export default Instant;