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

const getUserList = () => 
{
	

}



const createHistoryUrl = latest => {

	const token = "";

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

	const token = "";

	const limit = "150";

	let url = `https://slack.com/api/users.list?token=${token}&limit=${limit}&pretty=1`;

	return url;
};



const messageElement = document.createElement("div");
const timeElement = document.createElement("div");

const displayMessages = (messageResponse,userListResponse) => 
{
	const pageElement = document.createElement("div");
	pageElement.className = "pageElement";
	
	const userListCount = userListResponse.members.length;
	const messageCount = messageResponse.messages.length;

	
	for (let i = messageCount - 1; i >= 0; i--)
	{
		// プロフィールアイコン
		const profileIconElement = document.createElement("div");
		// 名前
		const nameTextElement = document.createElement("div");
		for(let j = 0;j < userListCount;j++)
		{
			if(messageResponse.messages[i].user == userListResponse.members[j].id)
			{
				profileIconElement.style.backgroundImage =   `url(${userListResponse.members[j].profile.image_48})`;

				if(userListResponse.members[j].profile.real_name ==  "川原　光二郎")
				{
				nameTextElement.className = "myNameText";
				}
				else
				{
				nameTextElement.className = "nameText";
				}
				nameTextElement.innerText = userListResponse.members[j].profile.real_name;
			}
		}
		//メッセージ
		const messageElement = document.createElement("div");
		//時間
		const timeElement = document.createElement("div");


		if(nameTextElement.innerText == "川原　光二郎")
		{
		//名前の設定

		//アイコンの設定
		profileIconElement.className = "myProfileIcon";
		//メッセージの設定
		messageElement.className = "myMessage";
		//時間の設定
		timeElement.className = "time";	
		}
		else
		{
		//名前の設定
		
		//アイコンの設定
		profileIconElement.className = "profileIcon";
		//メッセージの設定
		messageElement.className = "message";
		//時間の設定
		timeElement.className = "time";	
		}



		//メッセージ本文挿入
		messageElement.innerText = messageResponse.messages[i].text;
		//投稿時間の変換と挿入
		var month = new Date(messageResponse.messages[i].ts * 1000).getMonth() + 1;
		var day = new Date(messageResponse.messages[i].ts * 1000).getDate();
		var hour  = new Date(messageResponse.messages[i].ts * 1000).getHours();
		var minute  = new Date(messageResponse.messages[i].ts * 1000).getMinutes();
		var dayOfWeek  = new Date(messageResponse.messages[i].ts * 1000).getDay();
		var dayOfWeekStr  = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek];

		timeElement.innerText = `${month}月${day}日(${dayOfWeekStr})  　${hour}:${minute}`


		pageElement.appendChild(profileIconElement);
		pageElement.appendChild(messageElement);
		pageElement.appendChild(timeElement);
		pageElement.appendChild(nameTextElement);
		
	}

	const messagesContainer = document.querySelector(".messagesContainer");
	//messagesContainerにノードが追加されてなければpageElementを追加する
	//追加されていたら先頭に追加する
	if (messagesContainer.childElementCount === 0) 
	{
		messagesContainer.appendChild(pageElement);
	}
	else 
	{
		messagesContainer.insertBefore(pageElement, messagesContainer.children[0]);
	}
};
