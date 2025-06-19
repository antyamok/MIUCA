import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Settings, X, Check } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieManager: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const savedPreferences = localStorage.getItem('miuca-cookie-preferences');
    if (!savedPreferences) {
      // Délai pour laisser le temps à la page de se charger
      setTimeout(() => setShowBanner(true), 2000);
    } else {
      const parsed = JSON.parse(savedPreferences);
      setPreferences(parsed);
      // Charger Google Analytics si accepté
      if (parsed.analytics) {
        loadGoogleAnalytics();
      }
    }
  }, []);

  const loadGoogleAnalytics = () => {
    // Charger Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-3HWTKHBJPK';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3HWTKHBJPK', {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Strict;Secure'
      });
    `;
    document.head.appendChild(script2);
  };

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem('miuca-cookie-preferences', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    
    // Charger Google Analytics si accepté
    if (newPreferences.analytics && !preferences.analytics) {
      loadGoogleAnalytics();
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const acceptNecessary = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  return (
    <>
      {/* Banner compact positionné à droite */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-sage/10 rounded-lg">
                  <Cookie className="h-4 w-4 text-sage" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    🍪 Cookies "pas fait maison"
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    Nous utilisons des cookies pour améliorer votre expérience. 
                    Choisissez votre menu !
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={acceptAll}
                        className="flex-1 px-3 py-1.5 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors duration-300 text-xs font-medium"
                      >
                        <Check className="h-3 w-3 inline mr-1" />
                        Accepter
                      </button>
                      
                      <button
                        onClick={acceptNecessary}
                        className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-xs font-medium"
                      >
                        Refuser
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setShowSettings(true)}
                      className="w-full px-3 py-1.5 text-sage hover:text-sage/80 transition-colors duration-300 text-xs font-medium flex items-center justify-center"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Personnaliser
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowBanner(false)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de paramètres détaillés - plus compact */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-sage/10 rounded-lg">
                      <Shield className="h-4 w-4 text-sage" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Paramètres cookies
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-xs text-gray-600">
                  Gérez vos préférences de cookies. Modifiables à tout moment.
                </p>

                {/* Cookies nécessaires */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">Nécessaires</h3>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Activé</span>
                      <div className="w-8 h-4 bg-sage rounded-full flex items-center justify-end px-0.5">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Essentiels au fonctionnement du site.
                  </p>
                </div>

                {/* Cookies analytiques */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">Analytiques</h3>
                    <button
                      onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                      className={`w-8 h-4 rounded-full flex items-center transition-colors duration-300 ${
                        preferences.analytics ? 'bg-sage justify-end' : 'bg-gray-300 justify-start'
                      } px-0.5`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Analyse du trafic (Google Analytics anonymisé).
                  </p>
                </div>

                {/* Cookies marketing */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">Marketing</h3>
                    <button
                      onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                      className={`w-8 h-4 rounded-full flex items-center transition-colors duration-300 ${
                        preferences.marketing ? 'bg-sage justify-end' : 'bg-gray-300 justify-start'
                      } px-0.5`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Publicités personnalisées sur d'autres sites.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => savePreferences(preferences)}
                  className="flex-1 px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors duration-300 text-sm font-medium"
                >
                  Enregistrer
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium"
                >
                  Tout accepter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant compact pour rouvrir les paramètres */}
      {!showBanner && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setShowSettings(true)}
          className="fixed bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 z-40"
          title="Paramètres cookies"
        >
          <Cookie className="h-4 w-4 text-sage" />
        </motion.button>
      )}
    </>
  );
};

export default CookieManager;