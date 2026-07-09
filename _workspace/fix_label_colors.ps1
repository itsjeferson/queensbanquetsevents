$cssPath = "c:\queens-banquet-events\frontend\src\styles\invitation.css"
$content = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)

# 1. Update general envelope label styling to use var(--env-text-color)
$origLabelStyles = @"
.rl-envelope-label-top,
.rl-envelope-label-bottom {
  display: block;
  font-family: 'Great Vibes', cursive !important;
  font-size: 48px !important;
  text-transform: none !important;
  font-weight: 400 !important;
  letter-spacing: normal !important;
  transition: all 0.3s ease;
  pointer-events: none;
  line-height: 1;
}
"@

$newLabelStyles = @"
.rl-envelope-label-top,
.rl-envelope-label-bottom {
  display: block;
  font-family: 'Great Vibes', cursive !important;
  font-size: 48px !important;
  text-transform: none !important;
  font-weight: 400 !important;
  letter-spacing: normal !important;
  transition: all 0.3s ease;
  pointer-events: none;
  line-height: 1;
  color: var(--env-text-color) !important;
}
"@

# 2. Update general seal hint styling to use var(--env-text-color)
$origSealHint = @"
.rl-seal-hint {
  position: absolute;
  top: calc(100% + 12px);
  white-space: nowrap;
  font-size: 8px;
  letter-spacing: 0.2em;
  font-weight: 600;
}
"@

$newSealHint = @"
.rl-seal-hint {
  position: absolute;
  top: calc(100% + 12px);
  white-space: nowrap;
  font-size: 8px;
  letter-spacing: 0.2em;
  font-weight: 600;
  color: var(--env-text-color) !important;
}
"@

# 3. Clean up the theme-specific overrides to let them fallback to our CSS variables correctly
$origLuxuryLabel = @"
/* Royal Luxury Theme Specifics */
.theme-royal-luxury .rl-envelope-label-top,
.theme-royal-luxury .rl-envelope-label-bottom {
  color: #BE9B63 !important;
  text-shadow: 0 2px 10px rgba(190, 155, 99, 0.2);
}

/* Modern Minimalist Theme Specifics */
.theme-modern-minimalist .rl-envelope-label-top,
.theme-modern-minimalist .rl-envelope-label-bottom {
  color: #111827 !important;
}
"@

$newLuxuryLabel = @"
/* Royal Luxury Theme Specifics */
.theme-royal-luxury .rl-envelope-label-top,
.theme-royal-luxury .rl-envelope-label-bottom {
  text-shadow: 0 2px 10px rgba(190, 155, 99, 0.2);
}
"@

# Remove theme specific overrides that hardcode the text colors
$origLuxuryHint = @"
.theme-royal-luxury .rl-seal-hint {
  font-family: 'Montserrat', sans-serif;
  color: #BE9B63;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

.theme-modern-minimalist .rl-seal-hint {
  font-family: 'Inter', sans-serif;
  color: #111827;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
}
"@

$newLuxuryHint = @"
.theme-royal-luxury .rl-seal-hint {
  font-family: 'Montserrat', sans-serif;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

.theme-modern-minimalist .rl-seal-hint {
  font-family: 'Inter', sans-serif;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
}
"@

$content = $content.Replace($origLabelStyles, $newLabelStyles)
$content = $content.Replace($origSealHint, $newSealHint)
$content = $content.Replace($origLuxuryLabel.Replace("`r`n", "`n"), $newLuxuryLabel.Replace("`r`n", "`n"))
$content = $content.Replace($origLuxuryLabel, $newLuxuryLabel)
$content = $content.Replace($origLuxuryHint.Replace("`r`n", "`n"), $newLuxuryHint.Replace("`r`n", "`n"))
$content = $content.Replace($origLuxuryHint, $newLuxuryHint)

[System.IO.File]::WriteAllText($cssPath, $content, [System.Text.Encoding]::UTF8)
Write-Output "invitation.css updated to map envelope label and hint text colors to var(--env-text-color)."
