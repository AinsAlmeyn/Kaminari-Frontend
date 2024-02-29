import { HomePage, ProfilePage, TogetherPage, MoviePage, DiscordPage} from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/together',
        element: TogetherPage
    },
    {
        path: '/movie',
        element: MoviePage
    },
    {
        path: '/discord',
        element: DiscordPage
    }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
