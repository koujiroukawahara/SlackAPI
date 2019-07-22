var userListResponse;
window.onload = () => {

	const userListRequest = new XMLHttpRequest();
	
	userListRequest.open("GET", createUserListUrl(), true);
	userListRequest.send(null);
	userListRequest.onload = () => 
	{
		//文字列にデータを変換
		userListResponse = JSON.parse(userListRequest.responseText);
		getMessages();
	}
};


const sendMessage = () =>
{
	let textarea = document.getElementById("textbox");
	let xhr = new XMLHttpRequest();
	const token = "トークン";
	const channelID = "CB74M5Y6B";

	let url = `https://slack.com/api/chat.postMessage?token=${token}&channel=${channelID}&text=${textarea.value}`

    xhr.open("GET",url,true);
	xhr.send(null);   
	
	textarea.value = "";
}

const messagesRequest = new XMLHttpRequest();
const getMessages = (latest = 0) => 
{
	messagesRequest.open("GET", createHistoryUrl(latest), true);
	messagesRequest.send(null);		

	messagesRequest.onload = () => 
	{
			//文字列にデータを変換
			const messagesResponse = JSON.parse(messagesRequest.responseText);
			//表示する文字の設定
			displayMessages(messagesResponse,userListResponse);
		
				//全て呼ばれてない場合はコールバック
				if (messagesResponse.has_more) 
				{
					//要素数を代入
					const messageCount = messagesResponse.messages.length;

					//最後の要素数のタイムスタンプを代入
					const oldestTimeStamp = messagesResponse.messages[messageCount - 1].ts;

					//上のoldestTimeStampのタイムスタンプを引数にしてコールバック
					getMessages(oldestTimeStamp);
				}
	}
};


const createHistoryUrl = latest => {

	const token = "トークン";

	const channelID = "CB74M5Y6B";

	let url = `https://slack.com/api/channels.history?token=${token}&channel=${channelID}&count=10`;
	
	if (latest === null) {

		url += `&latest=${Date.now()}`

	} else {

		url += `&latest=${latest}`;
	}

	return url;
};

const createUserListUrl = latest => {

	const token = "トークン";

	const limit = "150";

	let url = `https://slack.com/api/users.list?token=${token}&limit=${limit}&pretty=1`;

	return url;
};


const displayMessages = (messageResponse,userListResponse) => 
{
	const userListCount = userListResponse.members.length;
	const messageCount = messageResponse.messages.length;
	const boxContainer = document.querySelector(".boxContainer");
	for (let i = 0; i <= messageCount - 1; i++)
	{
		const Container = document.createElement("div");//div1の役目
		const messageContainer = document.createElement("div");//div2の役目
		const profileIconContainer = document.createElement("div");//div3の役目
		const nameContainer = document.createElement("div");//div4の役目
		const messageandTimeContainer = document.createElement("div");//div5の役目
		const nameText = document.createElement("div");//div6の役目
		const messageText = document.createElement("div");//div7の役目
		const timeText = document.createElement("div");//div8の役目



		for(let j = 0;j < userListCount;j++)
		{
			if(messageResponse.messages[i].user == userListResponse.members[j].id)
			{
				profileIconContainer.style.backgroundImage =  `url(${userListResponse.members[j].profile.image_48})`;
				
				nameText.innerText = userListResponse.members[j].profile.real_name;
			}
		}



		Container.classList.add("Container");
		if(nameText.innerText == "川原　光二郎")
		{
			messageContainer.classList.add("myMessageContainer");
			profileIconContainer.classList.add("myProfileIconContainer");
			nameContainer.classList.add("myNameContainer");
			messageandTimeContainer.classList.add("myMessageandTimeContainer");
			nameText.classList.add("myNameText");
			messageText.classList.add("myMessageText");
			timeText.classList.add("myTimeText");
		}
		else
		{
			messageContainer.classList.add("messageContainer");
			profileIconContainer.classList.add("profileIconContainer");
			nameContainer.classList.add("nameContainer");
			messageandTimeContainer.classList.add("messageandTimeContainer");
			nameText.classList.add("nameText");
			messageText.classList.add("messageText");
			timeText.classList.add("timeText");
		}


	//メッセージ本文挿入
	messageText.innerText = messageResponse.messages[i].text;
	//投稿時間の変換と挿入
	var month = new Date(messageResponse.messages[i].ts * 1000).getMonth() + 1;
	var day = new Date(messageResponse.messages[i].ts * 1000).getDate();
	var hour  = new Date(messageResponse.messages[i].ts * 1000).getHours();
	var minute  = new Date(messageResponse.messages[i].ts * 1000).getMinutes();
	var dayOfWeek  = new Date(messageResponse.messages[i].ts * 1000).getDay();
	var dayOfWeekStr  = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek];
	timeText.innerText = `${month}月${day}日(${dayOfWeekStr})  　${hour}:${minute}`

	if(nameText.innerText == "川原　光二郎")
	{
		messageandTimeContainer.appendChild(timeText);
		messageandTimeContainer.appendChild(messageText);
	}
	else{
	messageandTimeContainer.appendChild(messageText);
	messageandTimeContainer.appendChild(timeText);
	}

	nameContainer.appendChild(nameText);
	nameContainer.appendChild(messageandTimeContainer);

	messageContainer.appendChild(profileIconContainer);
	messageContainer.appendChild(nameContainer);
	
	Container.appendChild(messageContainer);
	Container.insertBefore(messageContainer, Container.children[0]);

	const box = document.querySelector(".boxContainer");
	if (box.childElementCount === 0) 
	{
		box.appendChild(Container);
	}
	else 
	{
		box.insertBefore(Container, box.children[0]);
	}
	}
};
