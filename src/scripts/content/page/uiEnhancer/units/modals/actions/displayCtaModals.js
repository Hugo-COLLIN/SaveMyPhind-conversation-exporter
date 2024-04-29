import ModalMessage from "../units/ModalMessage";
import {getStorageData} from "../../../../../../shared/utils/chromeStorage";
import {
  clickCounts,
  resetClickCount,
  updateClickIconCount
} from "../../../../../../background/icon/state/clickIconCountContext";

const MODAL_SURVEY = 'assets/modalMessages/modalSurvey.md';
const MODAL_DONATION = 'assets/modalMessages/modalDonation.md';

// Array of modals
const modals = [MODAL_SURVEY, MODAL_DONATION, MODAL_SURVEY, MODAL_DONATION];

/**
 * Check the click count and display the modal if needed
 * @returns {Promise<void>}
 */
export async function handleModalDisplay() {
  const clickIconCount = await getStorageData('clickIconCount');
  const modalIndex = await getStorageData('modalIndex');

  // Display modal if needed
  if (clickIconCount > 0) return;
  await new ModalMessage(modals[modalIndex]).appendModal();

  // Increment modal index
  let nextIndex = (modalIndex + 1) % modals.length;
  resetClickCount(clickCounts[nextIndex]);
  chrome.storage.sync.set({"modalIndex": nextIndex});
  updateClickIconCount();
}



//Mode: loop, keep last modal
