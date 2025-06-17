import Dashboard from "../pages/Dashboard/Dashboard";
import HomePage from "../pages/Home/HomePage";
import MChart from "../pages/MChart/MChart";
import AlbumsList from "../pages/Dashboard/Album/AlbumsList";
import CollaboratorList from "../pages/Dashboard/Collaborator/CollaboratorList";
import PlayList from "../pages/Dashboard/PlayList/PlayList";
import ArtistList from "../pages/Dashboard/Artist/ArtistList";
import SongList from "../pages/Dashboard/Song/SongList";
import SongCreate from "../pages/Dashboard/Song/SongCreate";
import {AlbumCreate} from "../pages/Dashboard/Album/AlbumCreate";
import {ArtistCreate} from "../pages/Dashboard/Artist/ArtistCreate";
import {Album} from "../pages/Album/Album";
import {TopWeek} from "../pages/TopWeek/TopWeek";
import {Artist} from "../pages/Artist/Artist";
import {Top100Songs} from "../pages/Top100/Top100Songs";
import {NewRatings} from "../pages/NewRatings/NewRatings";
import {FavoriteList} from "../pages/Favorite/FavoriteList";
import NewRelease from "../pages/NewRelease/NewRelease";
import {PlaylistInformation} from "../pages/Playlist/PlaylistInformation/PlaylistInformation";
import {PlaylistCreate} from "../pages/Dashboard/PlayList/PlaylistCreate";
import {PlaylistUpdate} from "../pages/Dashboard/PlayList/PlaylistUpdate";
import {CollaboratorCreate} from "../pages/Dashboard/Collaborator/CollaboratorCreate";
import Hub from "../pages/Hub/Hub";
import UserEditInformation from "../pages/UserInformation/UserEditInformation";
import History from "../pages/History/History";
import {Song} from "../pages/Song/Song";
import Vip from "../pages/Vip/Vip";
import PaymentResult from "../pages/Vip/PaymentResult";
import Payments from "../pages/Payment/Payments";
import PlaylistForUser from "../pages/Playlist/PlaylistListForUser";
import {PlaylistUpdateForUser} from "../pages/Playlist/PlaylistUpdateForUser/PlaylistUpdateForUser";
import PaymentDashboard from "../pages/Dashboard/Payment/PaymentDashboard";
import ChangePassword from "../pages/UserInformation/ChangePassword";
import ChatBoxForHelpUser from "../components/ChatBoxForHelpUser/ChatBoxForHelpUser";




export const userRoutes = [
  {
    path: '/',
    component: <HomePage/>,
    exact: true,
  },
  {
    path: '/history',
    component: <History />,
  },
  {
    path: '/payments/result',
    component: <PaymentResult />
  },
  {
    path: '/m-chart',
    component: <MChart />,
  },
  {
    path: '/vip',
    component: <Vip />,
    private: true,
  },
  {
    path: '/m-chart-week/:national',
    component: <TopWeek />,
  },
  {
    path: '/playlists',
    component: <PlaylistForUser />,
  },
  {
    path: '/new-songs-ratings',
    component: <NewRatings/>,
  },
  {
    path: '/top-100-songs',
    component: <Top100Songs />,
  },
  {
    path: '/albums/:id',
    component: <Album/>,
  },
  {
    path: '/playlist-update-for-user/:id',
    component: <PlaylistUpdateForUser/>,
  },
  {
    path: '/song/:id',
    component: <Song/>,
  },
  {
    path: '/artists/:id',
    component: <Artist/>,
  },
  {
    path: '/hub',
    component: <Hub/>,
  },
  {
    path: '/favorites',
    component: <FavoriteList />,
    private: true,
  },
  {
    path: '/new-release/:option',
    component: <NewRelease />,
  },
  {
    path: '/playlist/:id',
    component: <PlaylistInformation/>,
  },
  {
    path: '/payments',
    component: <Payments/>,
  },
  {
    path: '/edit-user-information',
    component: <UserEditInformation/>,
    private: true,
  },
  {
    path: '/change-password',
    component: <ChangePassword/>,
    private: true,
  },
];

export const adminRoutes = [
  {
    path: '/dashboard',
    component: <Dashboard/>,
    private: true,
  },
  {
    path: '/dashboard/collaborators',
    component: <CollaboratorList />,
    private: true,
  },
  {
    path: '/dashboard/collaborator-create',
    component: <CollaboratorCreate />,
    private: true,
  },
  {
    path: '/dashboard/collaborator-update/:id',
    component: <CollaboratorCreate />,
    private: true,
  },
  {
    path: '/dashboard/songs',
    component: <SongList />,
    private: true,
  },
  {
    path: '/dashboard/song-create',
    component: <SongCreate />,
    private: true,
  },
  {
    path: '/dashboard/song-update/:id',
    component: <SongCreate />,
    private: true,
  },
  {
    path: '/dashboard/artists',
    component: <ArtistList />,
    private: true,
  },
  {
    path: '/dashboard/artist-create',
    component: <ArtistCreate />,
    private: true,
  },
  {
    path: '/dashboard/artist-update/:id',
    component: <ArtistCreate />,
    private: true,
  },
  {
    path: '/dashboard/albums',
    component: <AlbumsList />,
    private: true,
  },
  {
    path: '/dashboard/album-create',
    component: <AlbumCreate />,
    private: true,
  },
  {
    path: '/dashboard/album-update/:id',
    component: <AlbumCreate />,
    private: true,
  },
  {
    path: '/dashboard/playlists',
    component: <PlayList />,
    private: true,
  },
  {
    path: '/dashboard/playlist-create',
    component: <PlaylistCreate />,
    private: true,
  },
  {
    path: '/dashboard/playlist-update/:id',
    component: <PlaylistUpdate />,
    private: true,
  },
  {
    path: '/dashboard/payments',
    component: <PaymentDashboard />,
    private: true,
  }
];