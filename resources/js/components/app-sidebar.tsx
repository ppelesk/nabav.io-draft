import { Link } from '@inertiajs/react';
import {
    BookOpen,
    CircleDot,
    FolderGit2,
    LayoutGrid,
    Network,
    Tags,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain, type MainNavItem } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: MainNavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Administracija sustava',
        icon: Users,
        items: [
            {
                title: 'Šifrarnici',
                icon: Tags,
                items: [
                    {
                        title: 'Upravljanje ulogama',
                        href: '/uloge',
                    },
                    {
                        title: 'Upravljanje lokacijama',
                        href: '/lokacije',
                    },
                    {
                        title: 'Upravljanje odjelima',
                        href: '/odjeli',
                    },
                    {
                        title: 'Upravljanje kategorijama imovine',
                        href: '/kategorije-imovine',
                    },
                    {
                        title: 'Upravljanje statusima imovine',
                        href: '/status-imovine',
                    },
                    {
                        title: 'Upravljanje zgradama',
                        href: '/zgrade',
                    },
                ],
            },
            {
                title: 'Upravljanje zaposlenicima',
                href: '/zaposlenici',
            },
            {
                title: 'Upravljanje korisnicima',
                href: '/korisnici',
            },
            {
                title: 'Audit log',
                href: '/audit-log',
                icon: CircleDot,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
