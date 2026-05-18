import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type { ComponentType } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';

import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export type MainNavItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    icon?: ComponentType<{ className?: string }> | null;
    disabled?: boolean;
    items?: MainNavItem[];
    roles?: string[]; // Array of role codes (sifra_uloge) allowed to see this item
};

export function NavMain({ items = [] }: { items: MainNavItem[] }) {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.sifra_uloge;

    const filterByRole = (item: MainNavItem) => {
        if (!item.roles) return true;
        if (!userRole) return false;
        return item.roles.includes(userRole);
    };

    const filterItems = (items: MainNavItem[]): MainNavItem[] => {
        return items
            .filter(filterByRole)
            .map((item) => ({
                ...item,
                items: item.items ? filterItems(item.items) : undefined,
            }))
            .filter((item) => !item.items || item.items.length > 0);
    };

    const filteredItems = filterItems(items);

    const hasActiveDescendant = (item: MainNavItem): boolean => {
        if (item.href && isCurrentOrParentUrl(item.href)) {
            return true;
        }

        return (item.items ?? []).some(hasActiveDescendant);
    };

    const renderLeafSubItem = (item: MainNavItem) => {
        if (!item.href || item.disabled) {
            return (
                <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton asChild>
                        <span className="opacity-60">{item.title}</span>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
            );
        }

        return (
            <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton asChild isActive={isCurrentUrl(item.href)}>
                    <Link href={item.href} prefetch>
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    };

    const renderSubItem = (item: MainNavItem) => {
        if (!item.items || item.items.length === 0) {
            return renderLeafSubItem(item);
        }

        const open = hasActiveDescendant(item);

        return (
            <SidebarMenuSubItem key={item.title}>
                <Collapsible defaultOpen={open} className="group/collapsible-sub">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuSubButton isActive={open}>
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible-sub:rotate-90" />
                        </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub className="mt-1">
                            {item.items.map(renderLeafSubItem)}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuSubItem>
        );
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Navigacija</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.items && item.items.length > 0 ? (
                            <Collapsible
                                defaultOpen={hasActiveDescendant(item)}
                                className="group/collapsible"
                            >
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        isActive={hasActiveDescendant(item)}
                                        tooltip={{ children: item.title }}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub className="mt-1">
                                        {item.items.map(renderSubItem)}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </Collapsible>
                        ) : item.href && !item.disabled ? (
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        ) : (
                            <SidebarMenuButton
                                className="opacity-60"
                                tooltip={{ children: item.title }}
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
