"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ky from "ky";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Cookie from "js-cookie";
import BoringAvatars from "boring-avatars";
import { FC, useCallback, useMemo } from "react";
import { decodeJwt } from "jose";
import { join } from "lodash";

const apiURL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";
const api = ky.extend({ prefixUrl: apiURL });

const connect = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();

  const provider = new ethers.BrowserProvider(connection);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const { message } = await api
    .post("v1/auth/request", {
      json: {
        address,
      },
    })
    .json<{ message: string }>();
  const signature = await signer.signMessage(message);
  //post to server
  const data = await api
    .post("v1/auth", {
      json: { address, message, signature },
    })
    .json<{ token: string }>();

  Cookie.set("accessToken", data.token);
};

const ConnectButton: FC<{}> = () => {
  return (
    <Button onClick={connect} variant="secondary" className="h-8">
      Connect
    </Button>
  );
};

const ADDRESS_PADDING = 5;

export function UserNav() {
  const accessToken = Cookie.get("accessToken");

  const address = useMemo(
    () => accessToken && (decodeJwt(accessToken).wallet_address as string),
    [accessToken]
  );

  if (!address) {
    return <ConnectButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/03.png" alt="@shadcn" />
            <AvatarFallback asChild>
              <BoringAvatars name={address} size={36} variant="beam" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">shadcn</p>
            <p className="text-xs leading-none text-muted-foreground">
              {join(
                [
                  address.slice(0, ADDRESS_PADDING + 2),
                  address.slice(address.length - ADDRESS_PADDING),
                ],
                "..."
              )}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
