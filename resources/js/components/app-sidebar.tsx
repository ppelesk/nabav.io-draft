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
import { NavMain  } from '@/components/nav-main';
import type {MainNavItem} from '@/components/nav-main';
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
                        title: 'Uloge',
                        href: '/uloge',
                    },
                    {
                        title: 'Lokacije',
                        href: '/lokacije',
                    },
                    {
                        title: 'Odjeli',
                        href: '/odjeli',
                    },
                    {
                        title: 'Kategorije imovine',
                        href: '/kategorije-imovine',
                    },
                    {
                        title: 'Statusi imovine',
                        href: '/status-imovine',
                    },
                    {
                        title: 'Zgrade',
                        href: '/zgrade',
                    },
                ],
            },
            {
                title: 'Zaposlenici',
                href: '/zaposlenici',
            },
            {
                title: 'Korisnici',
                href: '/korisnici',
            },
            {
                title: 'Audit log',
                href: '/audit-log',
                icon: CircleDot,
            },
        ],
    },
    {
        title: 'Upravljanje imovinom',
        icon: Network,
        items: [
            {
                title: 'CRUD imovine',
                items: [
                    {
                        title: 'Popis imovine',
                        href: '/imovina',
                    },
                    {
                        title: 'Dodaj imovinu',
                        href: '/imovina/create',
                    },
                ],
            },
            {
                title: 'Zaduzenje imovine',
                href: '/imovina/zaduzenje',
            },
            {
                title: 'Razduzenje imovine',
                href: '/imovina/razduzenje',
            },
            {
                title: 'Barkod naljepnice',
                href: '/imovina/barkod-naljepnice',
            },
            {
                title: 'Inventura',
                href: '/inventura',
            },
            {
                title: 'Inventurne liste',
                href: '/inventurna-lista',
            },
            {
                title: 'Izvjestaji',
                href: '/izvjestaji',
            },
            {
                title: 'Provjera barkoda',
                href: '/provjera-barkoda',
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
