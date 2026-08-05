import Sundook from "@/models/Sundook";
import Welfare from "@/models/Welfare";
import DebtRequest from "@/models/DebtRequest";
import User from "@/models/User";

/**
 * Checks whether a receipt number is unique within its module.
 * @param {string} moduleName - "sundook" | "welfare" | "debt" | "membership"
 * @param {string} receiptNumber - The receipt number to validate
 * @param {string|null} excludeRecordId - ID of current record to exclude when updating
 * @returns {Promise<{ isUnique: boolean, message?: string }>}
 */
export async function checkReceiptUniqueness(
  moduleName,
  receiptNumber,
  excludeRecordId = null,
) {
  if (!receiptNumber || typeof receiptNumber !== "string") {
    return { isUnique: true };
  }

  const trimmedReceipt = receiptNumber.trim();
  if (!trimmedReceipt) return { isUnique: true };

  const regexPattern = new RegExp(`^${trimmedReceipt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i");

  if (moduleName === "sundook") {
    const query = { receipt_number: regexPattern };
    if (excludeRecordId) query._id = { $ne: excludeRecordId };
    const existing = await Sundook.findOne(query);
    if (existing) {
      return {
        isUnique: false,
        message: `Receipt number '${trimmedReceipt}' is already in use`,
      };
    }
  } else if (moduleName === "welfare") {
    const query = { receipt_number: regexPattern };
    if (excludeRecordId) query._id = { $ne: excludeRecordId };
    const existing = await Welfare.findOne(query);
    if (existing) {
      return {
        isUnique: false,
        message: `Receipt number '${trimmedReceipt}' is already in use`,
      };
    }
  } else if (moduleName === "debt") {
    const query = { receipt_no: regexPattern };
    if (excludeRecordId) query._id = { $ne: excludeRecordId };
    const existing = await DebtRequest.findOne(query);
    if (existing) {
      return {
        isUnique: false,
        message: `Receipt number '${trimmedReceipt}' is already in use`,
      };
    }
  } else if (moduleName === "membership") {
    const query = { "membership_renewals.receipt_number": regexPattern };
    if (excludeRecordId) query._id = { $ne: excludeRecordId };
    const existing = await User.findOne(query);
    if (existing) {
      return {
        isUnique: false,
        message: `Receipt number '${trimmedReceipt}' is already in use`,
      };
    }
  }

  return { isUnique: true };
}
