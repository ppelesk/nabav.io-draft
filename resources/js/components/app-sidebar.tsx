import { Link } from '@inertiajs/react';
import {
    BookOpen,
    CircleDot,
    FolderGit2,
    LayoutGrid,
    Network,
    Search,
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
        roles: ['administrator_sustava'],
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
        roles: ['administrator_sustava', 'upravitelj_imovinom'],
        items: [

            {
                title: 'Popis imovine',
                href: '/imovina',
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
                title: 'Provjera barkoda',
                href: '/provjera-barkoda',
            },
        ],
    },

    {
        title: 'Inventura',
        icon: Search,
        items: [
            
                        {
                title: 'Inventura',
                href: '/inventura',
            },
            {
                title: 'Inventurne liste',
                href: '/inventurna-lista',
            },
        
 
        ],
    },

    {
        title: 'Izvještaji',
        icon: LayoutGrid,
        items: [
            
            

                    { title: 'Izvještaj o provedenoj inventuri', href: '/izvjestaji/provedena-inventura' },
                    { title: 'Izvještaj o stanju imovine', href: '/izvjestaji/stanje-imovine' },
                    { title: 'Izvještaj o izdanoj imovini', href: '/izvjestaji/izdana-imovina' },
                    { title: 'Izvještaj o imovini u odjelima', href: '/izvjestaji/imovina-u-odjelima' },
                    { title: 'Izvještaj o imovini na lokacijama', href: '/izvjestaji/imovina-na-lokacijama' },
                    { title: 'Izvještaj o imovini po kategoriji', href: '/izvjestaji/imovina-po-kategoriji' },
                    { title: 'Izvještaj o imovini u skladištu', href: '/izvjestaji/imovina-u-skladistu' },
                    { title: 'Izvještaj o imovini na servisu', href: '/izvjestaji/imovina-na-servisu' },
                    { title: 'Izvještaj o rashodovanoj imovini', href: '/izvjestaji/rashodovana-imovina' },
                    { title: 'Izvještaj iz revizijskog traga', href: '/izvjestaji/revizijski-trag' },
                    { title: 'Izvještaj o imovini izdanoj na revers', href: '/izvjestaji/imovina-na-revers' },
            
        
 
        ],
    },
];

const footerNavItems: NavItem[] = [

    {
        title: 'Korisnička uputa (u izradi)',
        href: '#',
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
