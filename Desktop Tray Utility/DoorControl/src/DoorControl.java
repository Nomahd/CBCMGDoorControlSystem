import java.awt.AWTException;
import java.awt.Image;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.SystemTray;
import java.awt.Toolkit;
import java.awt.TrayIcon;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;


public class DoorControl
{
	public static void main(String[] args)
	{
		MainThread m = new MainThread();
		Thread mt = new Thread(m);
		mt.start();
	}
}

class MainThread extends TOOLBOX implements Runnable
{
	private static
	TrayIcon trayIcon ;
    MenuItem itemExit ;
    Image upImage, downImage ;
    String statusPath = GETENV("STATUSFILE");
    String lock = "Locked";
    String unlock = "Unlocked";
    
	MainThread()
	{
	    SETLOGLEVEL(GETENV("LOGLEVEL"));
	    SETLOGPREFIX(GETENV("LOGPREFIX"));
	    PopupMenu popMenu= new PopupMenu();
	    for(int i=1;i<=GETENVINT("MENUITEMS");i++)
	    {
	    	final int p = i;
	    	MenuItem menuItem = new MenuItem(GETENV("MENUITEM"+i));
		    popMenu.add(menuItem);
		    String sCOMMAND = GETENV("MENUCOMMAND"+i);
		    if(!sCOMMAND.equals(""))
		    {
			    menuItem.setActionCommand(sCOMMAND);
			    menuItem.addActionListener
			    (		    		
			    	new ActionListener() 
			    	{
			    		public void actionPerformed(ActionEvent ae) 
			    		{		 
			    			String cmd = ae.getActionCommand();
			    			LOG("COMMAND="+cmd);
			    			SHELLEXEC(cmd, false, false);
			    			
			    			if (GETENV("MENUITEM"+p).equals("Grant Access"))
			    			{
			    			}
			    			else if(GETENV("MENUITEM"+p).equals("Unlock"))
			    			{
			    				trayIcon.setImage(upImage);
				    			trayIcon.setToolTip(GETENV("TIPSUP"));
			    			}
			    			
			    			else if(GETENV("MENUITEM"+p).equals("Card Only"))
			    			{
			    				trayIcon.setToolTip(GETENV("TIPSDOWN"));
				    			trayIcon.setImage(downImage);
			    			}
			    		}
			    	}
		    	);
		    }
	    }
	    
	    itemExit = new MenuItem("Exit");
	    popMenu.add(itemExit);
	    itemExit.addActionListener
	    (
	    	new ActionListener() 
	    	{
	    		public void actionPerformed(ActionEvent ae) 
	    		{
	    			System.exit(0);
	    		}
	    	}
	    );
	    Image img  = Toolkit.getDefaultToolkit().getImage(GETENV("PNGFILE"));
	    upImage    = Toolkit.getDefaultToolkit().getImage(GETENV("UPFILE"));
	    downImage  = Toolkit.getDefaultToolkit().getImage(GETENV("DOWNFILE"));
	    trayIcon = new TrayIcon(img, GETENV("PROJECT"), popMenu);
	    
	    try 
	    {
		    SystemTray.getSystemTray().add(trayIcon);
        } 
	    catch (AWTException e) 
        {
            LOG("TrayIcon could not be added.");
        }
	}
	
    public void run () 
	{
    	while(true)
    	{
	    	try
	    	{
	    		WatchService watcher = FileSystems.getDefault().newWatchService();
	        	WatchKey key = null;
	        	Path reqFolder = Paths.get(GETENV("REQFOLDER"));
	        	Path logFolder = Paths.get(GETENV("LOGFOLDER"));   
	 	
		    	
		    	reqFolder.register(watcher,
		    					StandardWatchEventKinds.ENTRY_CREATE);
		    	
		    	File statusFile = new File(statusPath);
		    	if (!statusFile.exists())
		    	{
		    		statusFile.createNewFile();
		    	}
		    	
		    	
		    	
		    	while(true)
		    	{
		    		
	
		    		try
		    		{
		    			key = watcher.take();
		    		}
		    		catch (InterruptedException e)
		    		{
		    			LOG("Could not obtain key.");
		    			continue;
		    			
		    		}
		    		
		    		for (WatchEvent<?> event: key.pollEvents())  			
		    		{
		    			@SuppressWarnings("unchecked")
						WatchEvent<Path> ev = (WatchEvent<Path>) event;
		    			String request = null;		    			
		    			File file = new File(reqFolder.toString(), ev.context().toString());
		    			BufferedReader inputStream = new BufferedReader(new FileReader(file));
		    				
	    				request = inputStream.readLine();
		    			
		    			
		    			if (request.equals("Grant Access"))
		    			{
		    				SHELLEXEC(GETENV("MENUCOMMAND1"), false, false);
		    			}
		    			else if (request.equals("Card Only"))
		    			{
		    				
		    				SHELLEXEC(GETENV("MENUCOMMAND3"), false, false);
		    				trayIcon.setToolTip(GETENV("TIPSDOWN"));
			    			trayIcon.setImage(downImage);
			    			
			    			
		    				
		    			}
		    			else if (request.equals("Unlock"))
		    			{
		    				SHELLEXEC(GETENV("MENUCOMMAND2"),false, false);    			
		    				trayIcon.setImage(upImage);
			    			trayIcon.setToolTip(GETENV("TIPSUP"));
		    			}
		    			inputStream.close();
		    			SLEEP(1000);
		    			
		    			File dir = new File(reqFolder.toString());
		    			
		    			if (dir.isDirectory())
		    			{
		    				File[] content = dir.listFiles();
		    				for (int i = 0; i < content.length; i++)
		    				{
		    					content[i].renameTo(new File(logFolder.toString() + "\\" + content[i].getName()));
		    					content[i].delete();
		    					
		    					if (request.equals("Unlock"))
		    					{
		    						FileOutputStream output = new FileOutputStream(statusFile, false);
		    						output.write(unlock.getBytes());
		    						output.close();
		    					}
		    						
		    					else if (request.equals("Card Only"))
		    					{
		    						FileOutputStream output = new FileOutputStream(statusFile, false);
		    						output.write(lock.getBytes());
		    						output.close();
		    					}
		    						
		    					
			    				
		    				}
		    			}
		    		
		    			
		    		}
		    		key.reset();
		    		
	
		    	}
		    	
	    	}
	    	catch (IOException ioe)
	    	{
	    		StringWriter sw = new StringWriter();
	    		ioe.printStackTrace(new PrintWriter(sw));
	    		String exceptionString = sw.toString();
	    		LOG(exceptionString);
	    		LOG("Watcher failed.");
	    		continue;
	    	}
    	}
	}
}
