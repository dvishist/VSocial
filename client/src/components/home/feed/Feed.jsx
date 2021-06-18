import '../../styles/feed.scss'
import Post from './Post'
import FeedItem from './FeedItem'

export default function Feed() {
    return <div className="feed">
        <Post />
        <FeedItem
            user={{
                username: 'Vishist Dura',
                profilePicture:'https://scontent-syd2-1.xx.fbcdn.net/v/t1.6435-9/125865340_3482284455195197_383758782487114615_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=FiziL2kWFdwAX_jRCV9&_nc_ht=scontent-syd2-1.xx&oh=4366468ffd95d4b8642b6ea613a5a798&oe=60D01B3D'
            }}

            post={{
                description: 'My first Post',
                likes: 5,
                createdAt:'5 days ago',
                image:'https://scontent-syd2-1.xx.fbcdn.net/v/t1.6435-9/185034607_4060566617334640_8044782399079525768_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=9267fe&_nc_ohc=F-1kIqLXPXUAX-MP7jT&_nc_ht=scontent-syd2-1.xx&oh=e4938f434c2c0046ac0ae2e33b236b0c&oe=60D13058'
            }}
            
        />
        <FeedItem
            user={{
                username: 'Sisan Shrestha',
                profilePicture:'https://scontent-syd2-1.xx.fbcdn.net/v/t1.6435-9/125865340_3482284455195197_383758782487114615_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=FiziL2kWFdwAX_jRCV9&_nc_ht=scontent-syd2-1.xx&oh=4366468ffd95d4b8642b6ea613a5a798&oe=60D01B3D'
            }}

            post={{
                description: 'COde is Poetry',
                likes: 2,
                createdAt:'2 days ago',
                image:'https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg'
            }}
            
        />
        <FeedItem
            user={{
                username: 'New User',
                profilePicture:'https://scontent-syd2-1.xx.fbcdn.net/v/t1.6435-9/125865340_3482284455195197_383758782487114615_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=FiziL2kWFdwAX_jRCV9&_nc_ht=scontent-syd2-1.xx&oh=4366468ffd95d4b8642b6ea613a5a798&oe=60D01B3D'
            }}

            post={{
                description: 'COde is Poetry',
                likes: 2,
                createdAt:'2 days ago',
                // image:'https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg'
            }}
            
        />
    </div>       
}