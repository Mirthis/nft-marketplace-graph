import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent,
  ItemSold as ItemSoldEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ActiveItem,
  ItemListed,
  ItemCancelled,
  ItemSold,
} from "../generated/schema";

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let itemCancelled = ItemCancelled.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemCancelled) {
    itemCancelled = new ItemCancelled(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
    itemCancelled.seller = event.params.seller;
    itemCancelled.nftAddress = event.params.nftAddress;
    itemCancelled.tokenId = event.params.tokenId;

    activeItem!.buyer = Address.fromString(
      "0x000000000000000000000000000000000000dEaD"
    );

    itemCancelled.save();
    activeItem!.save();
  }
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemListed.seller = event.params.seller;
  itemListed.nftAddress = event.params.nftAddress;
  itemListed.price = event.params.price;
  itemListed.tokenId = event.params.tokenId;

  activeItem.seller = event.params.seller;
  activeItem.nftAddress = event.params.nftAddress;
  activeItem.price = event.params.price;
  activeItem.tokenId = event.params.tokenId;

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListed.save();
  activeItem.save();
}

export function handleItemSold(event: ItemSoldEvent): void {
  let itemSold = ItemSold.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemSold) {
    itemSold = new ItemSold(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemSold.buyer = event.params.buyer;
  itemSold.nftAddress = event.params.nftAddress;
  itemSold.tokenId = event.params.tokenId;
  itemSold.price = event.params.price;
  itemSold.save();

  const activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  activeItem!.buyer = event.params.buyer;
  activeItem!.save();
}

const getIdFromEventParams = (tokenId: BigInt, nftaddress: Address): string => {
  return tokenId.toHexString() + nftaddress.toHexString();
};
