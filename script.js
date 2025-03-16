document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Add scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Form submission
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Form validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Here you would typically send the form data to your server
            // For now, we'll just show a success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
// Add this script to your page or to your global scripts
document.addEventListener('DOMContentLoaded', function() {
    // Function to remove the toast notification
    function removeToastNotification() {
      // Look for elements containing the development server IP
      const toastElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && 
        (el.textContent.includes('127.0.0.1:3000') || 
         el.textContent.includes('Thank you for your message'))
      );
      
      // Find the closest parent container for each match
      toastElements.forEach(el => {
        // Try to find the toast container (typically a positioned div with high z-index)
        let parent = el;
        while (parent && parent !== document.body) {
          // Check if this is likely the toast container
          const style = window.getComputedStyle(parent);
          if ((style.position === 'fixed' || style.position === 'absolute') && 
               style.zIndex > 10 && 
               parent !== document.getElementById('thankYouModal')) {
            // Hide it immediately
            parent.style.display = 'none';
            
            // Remove it from DOM
            setTimeout(() => {
              if (parent.parentNode) {
                parent.parentNode.removeChild(parent);
              }
            }, 10);
            
            break;
          }
          parent = parent.parentNode;
        }
      });
    }
  
    // Initial check
    removeToastNotification();
    
    // Set up a mutation observer to watch for the toast appearing
    const observer = new MutationObserver(function(mutations) {
      removeToastNotification();
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // Also set up a specific interceptor for the OK button
    document.addEventListener('click', function(e) {
      // Check if the clicked element is a button with text "OK"
      if (e.target.tagName === 'BUTTON' && e.target.textContent === 'OK') {
        // Check if it's inside a toast notification
        let parent = e.target;
        while (parent && parent !== document.body) {
          if (parent.textContent && parent.textContent.includes('127.0.0.1:3000')) {
            e.preventDefault();
            e.stopPropagation();
            
            let container = parent;
            // Find the entire toast container
            while (container && container !== document.body) {
              const style = window.getComputedStyle(container);
              if (style.position === 'fixed' || style.position === 'absolute') {
                container.style.display = 'none';
                if (container.parentNode) {
                  container.parentNode.removeChild(container);
                }
                break;
              }
              container = container.parentNode;
            }
            
            break;
          }
          parent = parent.parentNode;
        }
      }
    }, true);
  });

// This script needs to run as early as possible
(function() {
    // Function to remove the toast
    function removeToast() {
      // Target the specific toast element by its content
      const elementsToCheck = document.querySelectorAll('div, aside, span, section');
      
      for (const element of elementsToCheck) {
        if (element.textContent && element.textContent.includes('127.0.0.1:3000 says') && 
            element.textContent.includes('Thank you for your message')) {
          
          // Find the highest parent container that's likely the toast
          let toastContainer = element;
          while (toastContainer.parentElement && 
                 !toastContainer.classList.contains('container') && 
                 toastContainer !== document.body) {
            
            const style = window.getComputedStyle(toastContainer);
            if (style.position === 'fixed' && style.zIndex > 10) {
              break;
            }
            toastContainer = toastContainer.parentElement;
          }
          
          // If we found what looks like a toast container, remove it
          if (toastContainer) {
            console.log('Found toast container, removing...');
            toastContainer.remove();
            return true;
          }
        }
      }
      return false;
    }
  
    // Check immediately and then set up a recurring check
    function checkAndRemoveToast() {
      if (!removeToast()) {
        // If not found, set up a mutation observer to watch for it
        const observer = new MutationObserver((mutations) => {
          if (removeToast()) {
            observer.disconnect();
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Also check periodically
        setTimeout(checkAndRemoveToast, 500);
      }
    }
  
    // Start the process
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndRemoveToast);
    } else {
      checkAndRemoveToast();
    }
    
    // Also intercept and prevent the notification API
    if (window.Notification) {
      const originalNotification = window.Notification;
      window.Notification = function(title, options) {
        if (title.includes('127.0.0.1') || 
            (options && options.body && options.body.includes('Thank you for your message'))) {
          console.log('Blocked notification:', title);
          return;
        }
        return new originalNotification(title, options);
      };
      
      // Copy over static properties
      for (const prop in originalNotification) {
        if (originalNotification.hasOwnProperty(prop)) {
          window.Notification[prop] = originalNotification[prop];
        }
      }
    }
    
    // Override the alert function
    const originalAlert = window.alert;
    window.alert = function(message) {
      if (message && typeof message === 'string' && 
          (message.includes('127.0.0.1') || message.includes('Thank you for your message'))) {
        console.log('Blocked alert:', message);
        return;
      }
      return originalAlert.apply(this, arguments);
    };
    
    // Also try to intercept the OK button clicks
    document.addEventListener('click', function(e) {
      if (e.target && e.target.textContent === 'OK') {
        const parent = e.target.closest('div[role="dialog"]');
        if (parent && parent.textContent.includes('127.0.0.1:3000')) {
          e.preventDefault();
          e.stopPropagation();
          parent.remove();
        }
      }
    }, true);
  })();
});