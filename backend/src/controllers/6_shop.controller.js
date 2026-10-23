import { buyItem, getShopItems } from "../services/6_shop.service.js"

export async function getShopItemsController(req, res) {
  try {
    const store = await getShopItems()
    console.info("Shop items retrieved successfully")
    res.status(200).json(store)
  } catch (err) {
    console.error("Shop item retrieval failed")
    res.status(500).json({ message: "Failed to retrieve shop items" })
  }
}

export async function buyItemController(req, res) {
  try {
    const userId = req.user.id
    const { itemId } = req.body

    if (!itemId) {
      console.warn("Shop purchase rejected: item ID missing")
      return res.status(400).json({ message: "itemId is required" })
    }

    const newItem = await buyItem(itemId, userId)
    console.info("Shop purchase completed successfully")
    res.status(200).json(newItem)
  } catch (err) {
    console.error("Shop purchase failed")
    res.status(500).json({ message: "Shop purchase failed" })
  }
}