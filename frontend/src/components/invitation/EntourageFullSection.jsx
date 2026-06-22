function NameList({ items }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!list.length) return null;
  return (
    <ul className="inv-entourage-names">
      {list.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

function SingleName({ value }) {
  if (!value?.trim()) return null;
  return <p className="inv-entourage-single">{value}</p>;
}

export default function EntourageFullSection({ entourage }) {
  if (!entourage) return null;

  const {
    groom,
    bride,
    principal_sponsors: principal,
    secondary_sponsors: secondary,
    best_men: bestMen,
    maid_of_honor: maidOfHonor,
    groomsmen,
    bridesmaids,
    bible_bearer: bibleBearer,
    ring_bearer: ringBearer,
    coin_bearer: coinBearer,
    flower_girls: flowerGirls,
  } = entourage;

  const maidList = Array.isArray(maidOfHonor) ? maidOfHonor : (maidOfHonor ? [maidOfHonor] : []);
  const bibleList = Array.isArray(bibleBearer) ? bibleBearer : (bibleBearer ? [bibleBearer] : []);
  const ringList = Array.isArray(ringBearer) ? ringBearer : (ringBearer ? [ringBearer] : []);
  const coinList = Array.isArray(coinBearer) ? coinBearer : (coinBearer ? [coinBearer] : []);

  const hasContent = [
    groom?.name,
    groom?.parents?.length,
    bride?.name,
    bride?.parents?.length,
    principal?.male?.length,
    principal?.female?.length,
    secondary?.candle?.length,
    secondary?.veil?.length,
    secondary?.cord?.length,
    bestMen?.length,
    maidList.length,
    groomsmen?.length,
    bridesmaids?.length,
    bibleList.length,
    ringList.length,
    coinList.length,
    flowerGirls?.length,
  ].some(Boolean);

  if (!hasContent) return null;

  return (
    <section className="inv-section inv-entourage-full" id="entourage">
      <p className="inv-section-tag">With Love</p>
      <h2>The Entourage</h2>
      <div className="inv-divider" />

      <div className="inv-entourage-couple-row">
        <div>
          <h4>Groom</h4>
          <SingleName value={groom?.name} />
          {groom?.parents?.length > 0 && (
            <>
              <span>Parents of the Groom</span>
              <NameList items={groom.parents} />
            </>
          )}
        </div>
        <div>
          <h4>Bride</h4>
          <SingleName value={bride?.name} />
          {bride?.parents?.length > 0 && (
            <>
              <span>Parents of the Bride</span>
              <NameList items={bride.parents} />
            </>
          )}
        </div>
      </div>

      {(bestMen?.length || maidList.length) && (
        <div className="inv-entourage-block">
          <div className="inv-entourage-split">
            <div>
              <span>Best Man{bestMen?.length > 1 ? 's' : ''}</span>
              <NameList items={bestMen} />
            </div>
            <div>
              <span>Maid of Honor{maidList.length > 1 ? 's' : ''}</span>
              <NameList items={maidList} />
            </div>
          </div>
        </div>
      )}

      {(groomsmen?.length || bridesmaids?.length) && (
        <div className="inv-entourage-block">
          <div className="inv-entourage-split">
            <div>
              <span>Groomsmen</span>
              <NameList items={groomsmen} />
            </div>
            <div>
              <span>Bridesmaids</span>
              <NameList items={bridesmaids} />
            </div>
          </div>
        </div>
      )}

      {(principal?.male?.length || principal?.female?.length) && (
        <div className="inv-entourage-block">
          <h4>Principal Sponsors</h4>
          <div className="inv-entourage-split">
            <div>
              <span>Male Sponsors</span>
              <NameList items={principal.male} />
            </div>
            <div>
              <span>Female Sponsors</span>
              <NameList items={principal.female} />
            </div>
          </div>
        </div>
      )}

      {(secondary?.candle?.length || secondary?.veil?.length || secondary?.cord?.length) && (
        <div className="inv-entourage-block">
          <h4>Secondary Sponsors</h4>
          <div className="inv-entourage-triple">
            <div>
              <span>Candle Sponsors</span>
              <NameList items={secondary.candle} />
            </div>
            <div>
              <span>Veil Sponsors</span>
              <NameList items={secondary.veil} />
            </div>
            <div>
              <span>Cord Sponsors</span>
              <NameList items={secondary.cord} />
            </div>
          </div>
        </div>
      )}

      {(bibleList.length || ringList.length || coinList.length) && (
        <div className="inv-entourage-block">
          <div className="inv-entourage-triple">
            <div>
              <span>Bible Bearer{bibleList.length > 1 ? 's' : ''}</span>
              <NameList items={bibleList} />
            </div>
            <div>
              <span>Ring Bearer{ringList.length > 1 ? 's' : ''}</span>
              <NameList items={ringList} />
            </div>
            <div>
              <span>Coin Bearer{coinList.length > 1 ? 's' : ''}</span>
              <NameList items={coinList} />
            </div>
          </div>
        </div>
      )}

      {flowerGirls?.length > 0 && (
        <div className="inv-entourage-block">
          <h4>Flower Girls</h4>
          <NameList items={flowerGirls} />
        </div>
      )}
    </section>
  );
}
