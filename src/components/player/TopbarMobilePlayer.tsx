import logo from '../../assets/Logo.png'

function TopbarMobilePlayer() {
  return (
    <header className="player-mobile-topbar">
      <div className="player-mobile-topbar__brand">
        <img src={logo} alt="TennisHub logo" className="player-mobile-topbar__logo" />
      </div>

      <div className="player-mobile-topbar__user">
        <span className="player-mobile-topbar__hello">¡Hey Juan!</span>
        <span className="player-mobile-topbar__level-text">Your Level:</span>
        <span className="player-mobile-topbar__level-badge">5</span>
      </div>
    </header>
  )
}

export default TopbarMobilePlayer