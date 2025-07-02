"use client";

/**
 * @title AppKit Connect Button
 * @notice Simple component that renders the Reown AppKit connect button
 * @dev Uses the global appkit-button web component
 */

export default function AppKitConnectButton() {
  // @ts-expect-error - AppKit web component
  return <appkit-button />;
}
